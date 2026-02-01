const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW ROUTE
router.post('/force-reset-password', authController.forceResetPassword);

module.exports = router;