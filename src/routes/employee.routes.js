// src/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const employeeController = require('../controllers/employee.controller');

// Semua endpoint employee hanya untuk admin
router.get('/', auth('admin'), employeeController.getEmployees);
router.get('/:id', auth('admin'), employeeController.getEmployeeById);
router.post('/', auth('admin'), employeeController.createEmployee);  // Endpoint untuk menambah karyawan
router.put('/:id', auth('admin'), employeeController.updateEmployee);
router.delete('/:id', auth('admin'), employeeController.deleteEmployee);

module.exports = router;
