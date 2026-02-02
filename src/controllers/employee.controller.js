const bcrypt = require('bcrypt');
const { Employee, User, Company, Subscription, sequelize } = require('../models'); // Tambahkan sequelize import
const { Op } = require('sequelize');

// GET /api/employees (admin)
const getEmployees = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = { company_id: companyId };
    
    if (search) {
      // Gunakan iLike untuk PostgreSQL (Case Insensitive) atau Like untuk MySQL
      // Agar pencarian "budi" bisa menemukan "Budi"
      const operator = process.env.DB_DIALECT === 'postgres' ? Op.iLike : Op.like;
      
      where[Op.or] = [
        { first_name: { [operator]: `%${search}%` } },
        { last_name: { [operator]: `%${search}%` } },
        { branch: { [operator]: `%${search}%` } }, // Tambahan: Bisa cari by cabang
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

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    return res.json(employee);
  } catch (err) {
    console.error('getEmployeeById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/employees
const createEmployee = async (req, res) => {
  // Mulai Transaksi Database
  const t = await sequelize.transaction();

  try {
    const companyId = req.user.company_id;
    const today = new Date().toISOString().slice(0, 10);

    // 1. Cek Subscription
    const subscription = await Subscription.findOne({
      where: {
        company_id: companyId,
        status: 'active',
        end_date: { [Op.gte]: today }
      }
    });

    if (!subscription) {
      await t.rollback(); // Batalkan transaksi
      return res.status(403).json({ message: 'Action denied: No active subscription found.' });
    }

    const currentEmployeeCount = await Employee.count({ where: { company_id: companyId } });
    if (currentEmployeeCount >= subscription.num_employees) {
      await t.rollback();
      return res.status(403).json({ message: 'Limit reached. Upgrade required.' });
    }

    // 2. Tangkap SEMUA input (termasuk kolom baru)
    const { 
      first_name, last_name, email, password, 
      phone, gender, position, grade, branch, employment_status,
      nik, education, place_of_birth, date_of_birth,
      bank_name, bank_account_number, bank_account_holder
    } = req.body;

    if (!password) {
      await t.rollback();
      return res.status(400).json({ message: 'Password is required' });
    }

    // 3. Cek Duplikasi Email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: 'Email already used' });
    }

    // 4. Create Employee (Pakai transaction: t)
    const employee = await Employee.create({
      company_id: companyId,
      first_name, last_name, email, 
      phone, gender, position, grade, branch, employment_status,
      nik, education, place_of_birth, date_of_birth,
      bank_name, bank_account_number, bank_account_holder
    }, { transaction: t });

    // 5. Create User Account (Pakai transaction: t)
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'user',
      company_id: companyId,
      employee_id: employee.id,
    }, { transaction: t });

    // Commit: Simpan perubahan permanen jika semua sukses
    await t.commit();

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: { id: employee.id, email: employee.email },
    });

  } catch (err) {
    // Rollback: Batalkan semua perubahan jika ada error
    await t.rollback();
    console.error('createEmployee error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;
    const payload = req.body; // Isinya data update

    // Cari employee
    const employee = await Employee.findOne({ where: { id, company_id: companyId } });
    if (!employee) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Simpan email lama untuk pengecekan
    const oldEmail = employee.email;

    // Update Employee Table
    // Filter payload agar user tidak bisa ubah company_id atau id iseng-iseng
    const allowedUpdates = {
       first_name: payload.first_name,
       last_name: payload.last_name,
       email: payload.email,
       phone: payload.phone,
       gender: payload.gender,
       position: payload.position,
       grade: payload.grade,
       branch: payload.branch,
       employment_status: payload.employment_status,
       nik: payload.nik,
       education: payload.education,
       place_of_birth: payload.place_of_birth,
       date_of_birth: payload.date_of_birth,
       bank_name: payload.bank_name,
       bank_account_number: payload.bank_account_number,
       bank_account_holder: payload.bank_account_holder
    };

    await employee.update(allowedUpdates, { transaction: t });

    // Sinkronisasi ke Tabel User (Jika Email/Nama berubah)
    // Ini penting agar login tetap jalan jika email diganti admin
    if (payload.email || payload.first_name || payload.last_name) {
       await User.update(
         { 
           email: payload.email, 
           first_name: payload.first_name, 
           last_name: payload.last_name 
         },
         { where: { employee_id: id }, transaction: t }
       );
    }

    await t.commit();
    return res.json(employee);

  } catch (err) {
    await t.rollback();
    console.error('updateEmployee error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const companyId = req.user.company_id;
    const { id } = req.params;

    const employee = await Employee.findOne({ where: { id, company_id: companyId } });
    if (!employee) {
      await t.rollback();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Hapus User & Employee dalam satu paket
    await User.destroy({ where: { employee_id: id }, transaction: t });
    await employee.destroy({ transaction: t });

    await t.commit();
    return res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    await t.rollback();
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
