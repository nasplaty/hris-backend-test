const { Package, Attendance, Employee } = require('../models');

// Create new package (Only for admin system)
const createPackage = async (req, res) => {
  try {
    // 1. We now ask for ALL the fields, not just name and price
    const {
      name,
      price_per_user,
      description,
      duration_months,  // <--- Added this
      level,            // <--- Added this
      min_employees,    // <--- Added this
      max_employees     // <--- Added this
    } = req.body;

    // 2. (Optional but good) Basic Validation
    if (!name || !price_per_user) {
       return res.status(400).json({ message: 'Name and Price are required.' });
    }

    // 3. Create the package with ALL the data
    const newPackage = await Package.create({
      name,
      price_per_user,
      description,
      duration_months: duration_months || 1,        // Use 1 if they didn't send a duration
      level: level || 'standard',                   // Use 'standard' if they didn't send a level
      min_employees: min_employees || null,
      max_employees: max_employees || null,
    });

    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('createPackage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all packages (Only for admin system)
const getPackage = async (req, res) => {
  try {
    const packages = await Package.findAll();
    return res.json(packages);
  } catch (err) {
    console.error('getPackage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Approve Attendance (Only for admin company)
const approveAttendance = async (req, res) => {
  try {
    const companyId = req.user.company_id; // Get the Admin's Company ID
    const attendanceId = req.params.id;

    // 1. Find Attendance AND ensure it belongs to this company
    const attendance = await Attendance.findByPk(attendanceId, {
      include: [
        {
          model: Employee, // Make sure to import { Employee } at the top!
          where: { company_id: companyId }, // <--- SECURITY LOCK
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found or not in your company' });
    }

    // 2. Update the CORRECT column (status_approve)
    await attendance.update({ status_approve: 'approved' }); // <--- FIXED COLUMN NAME

    return res.json({ 
        message: 'Attendance approved', 
        employee: `${attendance.Employee.first_name} ${attendance.Employee.last_name}`,
        status: 'approved'
    });

  } catch (err) {
    console.error('approveAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reject Attendance (Only for admin company)
const rejectAttendance = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const attendanceId = req.params.id;

    const attendance = await Attendance.findByPk(attendanceId, {
      include: [
        {
          model: Employee, 
          where: { company_id: companyId } 
        }
      ]
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found or not in your company' });
    }

    // Update the CORRECT column
    await attendance.update({ status_approve: 'rejected' });

    return res.json({ message: 'Attendance rejected', status: 'rejected' });
  } catch (err) {
    console.error('rejectAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPackage,
  getPackage,
  approveAttendance,
  rejectAttendance,
};
