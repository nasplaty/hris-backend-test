const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Hanya admin sistem yang bisa mengelola paket
router.post('/package', auth('admin_system'), adminController.createPackage);
router.get('/package', auth('admin_system'), adminController.getPackage);

// Admin perusahaan bisa mengelola data kehadiran
router.put('/attendance/:id/approve', auth('admin_company'), adminController.approveAttendance);
router.put('/attendance/:id/reject', auth('admin_company'), adminController.rejectAttendance);

module.exports = router;
