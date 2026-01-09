const { Attendance, Employee } = require('../models');
const { Op } = require('sequelize');

// Helper untuk tanggal hari ini
const todayDateOnly = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // Format YYYY-MM-DD
};

// GET /api/attendance (admin) - list semua attendance di company
const getAttendanceList = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, date, status } = req.query;
    const offset = (page - 1) * limit;

    // join dengan Employee untuk filter company
    const where = {};
    if (date) where.date = date;
    if (status) where.status_approve = status;

    const { rows, count } = await Attendance.findAndCountAll({
      where,
      include: [
        {
          model: Employee,
          where: { company_id: companyId },  // Memastikan hanya employee dari company ini
          attributes: ['id', 'first_name', 'last_name', 'position'],
        },
      ],
      offset: Number(offset),
      limit: Number(limit),
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    });

    return res.json({
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  } catch (err) {
    console.error('getAttendanceList error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/my (user) - attendance milik employee login
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const { page = 1, limit = 10, month } = req.query;
    const offset = (page - 1) * limit;

    const where = { employee_id: employeeId };
    if (month) {
      // Format month: YYYY-MM, digunakan untuk mengambil data di bulan tertentu
      const start = `${month}-01`;
      const end = `${month}-31`;
      where.date = { [Op.between]: [start, end] }; // Filter data berdasarkan bulan
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      offset: Number(offset),
      limit: Number(limit),
      order: [['date', 'DESC']], // Urutkan berdasarkan tanggal
    });

    return res.json({
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  } catch (err) {
    console.error('getMyAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/attendance (user) - buat request presensi / izin
const createAttendance = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const {
      type = 'present',
      date,
      check_in,
      check_out,
      location_name,
      address,
      lat,
      lng,
      proof_url,
    } = req.body;

    // Validasi input: pastikan karyawan tidak mengisi absensi lebih dari satu kali dalam sehari
    const existingAttendance = await Attendance.findOne({
      where: {
        employee_id: employeeId,
        date: date || todayDateOnly(), // Cek absensi berdasarkan tanggal
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already recorded for this day.' });
    }

    const attendance = await Attendance.create({
      employee_id: employeeId,
      date: date || todayDateOnly(),
      check_in: check_in || null,
      check_out: check_out || null,
      type,
      location_name,
      address,
      lat,
      lng,
      proof_url,
      status_approve: 'waiting', // Status awal 'waiting'
    });

    return res.status(201).json(attendance);
  } catch (err) {
    console.error('createAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/attendance/:id/approve (admin) - approve attendance request
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

// PUT /api/attendance/:id/reject (admin) - reject attendance request
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

module.exports = {
  getAttendanceList,
  getMyAttendance,
  createAttendance,
  approveAttendance,
  rejectAttendance,
};
