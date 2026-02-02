const { Attendance, Employee, Subscription } = require('../models');
const { Op } = require('sequelize');

// Helper for today's date
const todayDateOnly = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // Format YYYY-MM-DD
};

// ==========================================
// ADMIN: Get All Attendance (FIXED)
// ==========================================
const getAttendanceList = async (req, res) => {
  try {
    // 1. Safety Check: Ensure User Exists
    if (!req.user || !req.user.company_id) {
       return res.status(401).json({ message: "Unauthorized: Missing Company Context" });
    }

    const companyId = req.user.company_id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    console.log(`DEBUG: Admin ${req.user.id} fetching attendance for Company ${companyId}`);

    // 2. Fetch Attendance
    const { count, rows } = await Attendance.findAndCountAll({
      distinct: true, 
      include: [
        {
          model: Employee,
          required: true, 
          where: { 
             company_id: companyId,
             [Op.or]: [
                { first_name: { [Op.like]: `%${search}%` } },
                { last_name: { [Op.like]: `%${search}%` } }
             ]
          },
          // REMOVED 'employee_id' from here. The table uses 'id'.
          attributes: ['id', 'first_name', 'last_name', 'position']
        }
      ],
      offset: Number(offset),
      limit: Number(limit),
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });

    console.log(`DEBUG: Found ${count} records`);

    return res.json({
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });

  } catch (err) {
    console.error('CRITICAL ERROR in getAttendanceList:', err);
    return res.status(500).json({ 
        message: 'Server Error fetching data', 
        error: err.message 
    });
  }
};



// ==========================================
// USER: Get My Attendance
// ==========================================
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const { page = 1, limit = 10, month } = req.query;
    const offset = (page - 1) * limit;

    const where = { employee_id: employeeId };
    if (month) {
      const start = `${month}-01`;
      const end = `${month}-31`;
      where.date = { [Op.between]: [start, end] };
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      offset: Number(offset),
      limit: Number(limit),
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    return res.json({
      data: rows,
      meta: { page: Number(page), limit: Number(limit), total: count },
    });
  } catch (err) {
    console.error('getMyAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==========================================
// USER: Create Attendance (Check In)
// ==========================================

const createAttendance = async (req, res) => {
  try {
    const { role, employee_id: myId, company_id: myCompanyId } = req.user;
    const isAdmin = ['admin_company', 'admin_system'].includes(role);

    // 1. DETERMINE TARGET EMPLOYEE
    // Default: The user acts for themselves
    let targetEmployeeId = myId;
    
    // ADMIN OVERRIDE: If Admin sends an ID, use that instead
    if (isAdmin && req.body.employee_id) {
        targetEmployeeId = req.body.employee_id;
    }

    if (!targetEmployeeId) return res.status(400).json({ message: 'Employee ID is required.' });

    // 2. FETCH DATA
    const employee = await Employee.findByPk(targetEmployeeId);
    if (!employee) return res.status(404).json({ message: 'Target Employee not found' });

    // Admin Company Check
    if (role === 'admin_company' && employee.company_id !== myCompanyId) {
        return res.status(403).json({ message: 'Unauthorized employee access.' });
    }

    // 3. SUBSCRIPTION CHECK (Active)
    const todayStr = new Date().toISOString().slice(0, 10);
    const activeSubscription = await Subscription.findOne({
        where: {
            company_id: employee.company_id,
            status: 'active',
            end_date: { [Op.gte]: todayStr }
        }
    });
    if (!activeSubscription) return res.status(403).json({ message: 'Action Blocked: Subscription inactive.' });

    // -------------------------------------------------------------
    // 4. SMART TIME LOGIC (The Fix)
    // -------------------------------------------------------------
    const {
      type = 'present', location_name, address, lat, lng, proof_url,
    } = req.body;

    let finalDate, finalCheckIn, finalCheckOut;

    if (isAdmin) {
        // === ADMIN MODE: MANUAL ENTRY ===
        // Admins can travel in time. Use the date/time they typed.
        finalDate = req.body.date || todayStr;

        const formatDateTime = (d, t) => t ? new Date(`${d}T${t}:00`) : null;
        finalCheckIn = formatDateTime(finalDate, req.body.check_in);
        finalCheckOut = formatDateTime(finalDate, req.body.check_out);

    } else {
        // === KARYAWAN MODE: REAL TIME ===
        // Employees CANNOT choose time. Force Server Time.
        finalDate = todayStr; // Always today

        if (type === 'present') {
             // If Clocking In -> NOW
             finalCheckIn = new Date(); 
             // Cannot Clock Out while creating (that's an update)
             finalCheckOut = null; 
        } else {
             // Leaves (Sick/Annual) don't have clock-in times
             finalCheckIn = null;
             finalCheckOut = null;
        }

        // Active Session Check (Only for Employees)
        const activeSession = await Attendance.findOne({
            where: {
                employee_id: targetEmployeeId,
                date: finalDate,
                check_out: null,
                type: 'present'
            },
        });
        if (activeSession) return res.status(400).json({ message: 'Active session exists. Please clock out first.' });
    }
    // -------------------------------------------------------------

    // 5. CREATE RECORD
    const attendance = await Attendance.create({
      employee_id: targetEmployeeId,
      date: finalDate,
      check_in: finalCheckIn,
      check_out: finalCheckOut,
      type, location_name, address, lat, lng, proof_url,
      // Admin entries auto-approved; Employee entries wait for approval
      status_approve: isAdmin ? 'approved' : 'waiting', 
    });

    return res.status(201).json({ message: 'Attendance created', data: attendance });

  } catch (err) {
    console.error('createAttendance error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// ==========================================
// ADMIN: Approve / Reject
// ==========================================
const approveAttendance = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id, {
      include: [{ model: Employee, attributes: ['company_id'] }],
    });

    if (!attendance || attendance.Employee.company_id !== companyId) {
      return res.status(404).json({ message: 'Attendance not found or not part of your company' });
    }

    await attendance.update({ status_approve: 'approved' });
    return res.json(attendance);
  } catch (err) {
    console.error('approveAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const rejectAttendance = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id, {
      include: [{ model: Employee, attributes: ['company_id'] }],
    });

    if (!attendance || attendance.Employee.company_id !== companyId) {
      return res.status(404).json({ message: 'Attendance not found or not part of your company' });
    }

    await attendance.update({ status_approve: 'rejected' });
    return res.json(attendance);
  } catch (err) {
    console.error('rejectAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==========================================
// USER: Clock In / Out / Update
// ==========================================
const clockIn = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.employee_id;
    const attendance = await Attendance.findOne({ where: { id, employee_id: employeeId } });

    if (!attendance) return res.status(404).json({ message: 'Record not found' });
    if (attendance.check_in) return res.status(400).json({ message: 'Already clocked in!' });

    await attendance.update({ check_in: new Date() });
    return res.json({ message: 'Clock in successful', data: attendance });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const clockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.employee_id;
    const attendance = await Attendance.findOne({ where: { id, employee_id: employeeId } });

    if (!attendance) return res.status(404).json({ message: 'Record not found' });
    if (attendance.check_out) return res.status(400).json({ message: 'Already clocked out!' });

    await attendance.update({ check_out: new Date() });
    return res.json({ message: 'Clock out successful', data: attendance });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.employee_id;
    const { type, location_name, address, lat, lng, date, check_in, check_out } = req.body;

    const attendance = await Attendance.findOne({ where: { id, employee_id: employeeId } });
    if (!attendance) return res.status(404).json({ message: 'Record not found' });

    await attendance.update({
      type, location_name, address, lat, lng, date, check_in, check_out,
      status_approve: 'waiting'
    });

    return res.json({ message: 'Attendance updated', data: attendance });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAttendanceList,
  getMyAttendance,
  createAttendance,
  approveAttendance,
  rejectAttendance,
  clockIn,
  clockOut,
  updateAttendance,
};