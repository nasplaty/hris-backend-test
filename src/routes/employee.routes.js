// src/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const employeeController = require('../controllers/employee.controller');

// ALLOW 'admin_company' (The Boss) to access these routes
router.get('/', auth('admin_company'), employeeController.getEmployees);
router.get('/:id', auth('admin_company'), employeeController.getEmployeeById);
router.post('/', auth('admin_company'), employeeController.createEmployee); 
router.put('/:id', auth('admin_company'), employeeController.updateEmployee);
router.delete('/:id', auth('admin_company'), employeeController.deleteEmployee);

module.exports = router;