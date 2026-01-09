// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');
const packageController = require('../controllers/package.controller');

// public: lihat paket
router.get('/packages', paymentController.getPackages);

// admin_system: buat paket baru
router.post('/packages', auth('admin_system'), packageController.createPackage);

// admin_company & user: lihat subscription aktif perusahaan
router.get('/subscription/current', auth(['admin_company', 'user']), paymentController.getCurrentSubscription);

// admin_company: buat subscription baru (beli paket)
router.post('/subscribe', auth('admin_company'), paymentController.createSubscription);

module.exports = router;
