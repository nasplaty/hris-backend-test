const bcrypt = require('bcrypt');
const { Employee, User, Company, Subscription } = require('../models');
const { Op } = require('sequelize');  // Import Op untuk query search

// GET /api/employees (admin) - list employee satu company
const getEmployees = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const offset = (page - 1) * limit;

    const where = { company_id: companyId };
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where,
      offset: Number(offset),
      limit: Number(limit),
      order: [['created_at', 'DESC']],
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
    console.error('getEmployees error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, company_id: companyId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json(employee);
  } catch (err) {
    console.error('getEmployeeById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const companyId = req.user.company_id;

// --- SECURITY CHECK: SUBSCRIPTION LIMIT ---
    const today = new Date().toISOString().slice(0, 10);

    // 1. Find Active Subscription
    const subscription = await Subscription.findOne({
      where: {
        company_id: companyId,
        status: 'active',
        end_date: { [Op.gte]: today } // Ensure it hasn't expired today
      }
    });

    if (!subscription) {
      return res.status(403).json({ message: 'Action denied: No active subscription found.' });
    }

    // 2. Count Current Employees
    const currentEmployeeCount = await Employee.count({
      where: { company_id: companyId }
    });

    // 3. Compare
    if (currentEmployeeCount >= subscription.num_employees) {
      return res.status(403).json({ 
        message: `Limit reached. Your plan allows ${subscription.num_employees} employees. Upgrade required.` 
      });
    }
    // ------------------------------------------

    // NEW: No default value (password is undefined if missing)
const { first_name, last_name, email, password, position, employment_status } = req.body; 
if (!password) {
    return res.status(400).json({ message: 'Password is required' });
}
    // Cek apakah email sudah ada di tabel employees atau users
    const existingEmployee = await Employee.findOne({ where: { email } });
    const existingUser = await User.findOne({ where: { email } });
    if (existingEmployee || existingUser) return res.status(400).json({ message: 'Email already used' });

    // Menyimpan data employee ke tabel employees
    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      employment_status,
      company_id: companyId,
    });

    // Enkripsi password dan buat user di tabel `users`
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,  // Password yang sudah dienkripsi
      role: 'user',  // Set role default untuk karyawan
      company_id: companyId,
      employee_id: employee.id,  // Menghubungkan dengan employee
    });

    return res.status(201).json({
      message: 'Employee added and user account created successfully',
      employee: { id: employee.id, email: employee.email },
    });
  } catch (err) {
    console.error('createEmployee error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,  // Log error untuk debugging
    });
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;
    const payload = req.body;

    const employee = await Employee.findOne({ where: { id, company_id: companyId } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update(payload);

    return res.json(employee);
  } catch (err) {
    console.error('updateEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;

    // 1. Find the Employee to ensure they belong to your company
    const employee = await Employee.findOne({ where: { id, company_id: companyId } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 2. Find the associated User account (The Login)
    const userAccount = await User.findOne({ where: { employee_id: id } });

    // 3. Delete the User Account FIRST (Security Best Practice)
    if (userAccount) {
        await userAccount.destroy();
    }

    // 4. Now Delete the Employee Profile
    await employee.destroy();

    return res.json({ message: 'Employee and associated User account have been permanently deleted.' });
  } catch (err) {
    console.error('deleteEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
