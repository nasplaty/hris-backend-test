// src/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const attendanceController = require('../controllers/attendance.controller');

// Admin Company: melihat seluruh absensi karyawan dalam perusahaannya
router.get('/', auth('admin_company'), attendanceController.getAttendanceList);

// User (karyawan): melihat absensi miliknya sendiri
router.get('/my', auth(['user', 'admin_company']), attendanceController.getMyAttendance);

// User (karyawan): membuat presensi / izin
router.post('/', auth(['user', 'admin_company']), attendanceController.createAttendance);

// Admin Company: menyetujui presensi
router.put('/:id/approve', auth('admin_company'), attendanceController.approveAttendance);

// Admin Company: menolak presensi
router.put('/:id/reject', auth('admin_company'), attendanceController.rejectAttendance);

// NEW: Clock In Route
router.patch('/:id/clockin', auth(['user', 'admin_company']), attendanceController.clockIn);

// NEW: Clock Out Route
router.patch('/:id/checkout', auth(['user', 'admin_company']), attendanceController.clockOut);

// NEW: Edit Route
router.put('/:id', auth(['user', 'admin_company']), attendanceController.updateAttendance);

module.exports = router;
