const { Package, Attendance } = require('../models');

// Create new package (Only for admin system)
const createPackage = async (req, res) => {
  try {
    const { name, price_per_user, description } = req.body;

    const newPackage = await Package.create({
      name,
      price_per_user,
      description,
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
    const attendanceId = req.params.id;
    const attendance = await Attendance.findByPk(attendanceId);

    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    await attendance.update({ status: 'approved' });

    return res.json({ message: 'Attendance approved', attendance });
  } catch (err) {
    console.error('approveAttendance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reject Attendance (Only for admin company)
const rejectAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const attendance = await Attendance.findByPk(attendanceId);

    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    await attendance.update({ status: 'rejected' });

    return res.json({ message: 'Attendance rejected', attendance });
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
