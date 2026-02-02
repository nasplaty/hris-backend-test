// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');  // Assuming this is the correct path

// Route to change password
router.put('/change-password', auth('user'), userController.changePassword); // Ensure only logged-in users can access this route

module.exports = router;
