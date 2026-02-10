// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

// 1. Change Password
// UPDATE: Allow ['user', 'admin_company'] so admins can change passwords too
router.put('/change-password', auth(['user', 'admin_company']), userController.changePassword);

// 2. Update Profile (The New Feature)
// This matches the axios.put('/user/profile') call in your Sidebar
router.put('/profile', auth(['admin_company', 'user']), userController.updateProfile);

router.get('/profile', auth(['admin_company', 'user']), userController.getProfile);

module.exports = router;