const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');

const ALLOWED_ROLES = ['admin_system', 'admin_company', 'user'];

const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role = 'user',
      company_name,
      company_id, // jika company sudah ada
      employee_id, // untuk user/karyawan (opsional)
    } = req.body;

    // 1) validasi role
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }

    // 2) cek email unik
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email sudah digunakan' });

    // 3) tentukan company
    let company = null;

    if (role === 'admin_company') {
      if (company_name) {
        company = await Company.create({ name: company_name });
      } else if (company_id) {
        company = await Company.findByPk(company_id);
        if (!company) return res.status(404).json({ message: 'Company tidak ditemukan' });
      } else {
        return res.status(400).json({ message: 'admin_company wajib memiliki company_name atau company_id' });
      }
    }

    if (role === 'user') {
      if (!company_id) {
        return res.status(400).json({ message: 'User/karyawan wajib memiliki company_id' });
      }
      company = await Company.findByPk(company_id);
      if (!company) return res.status(404).json({ message: 'Company tidak ditemukan' });
    }

    // 4) password
    const passwordToUse = password || 'defaultPassword123!';
    const hash = await bcrypt.hash(passwordToUse, 10);

    // 5) create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hash,  // Menggunakan 'password' sebagai ganti 'password_hash'
      role,
      employee_id: employee_id || null,
      company_id: company ? company.id : null,
    });

    return res.status(201).json({
      message: 'Registered',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        employee_id: user.employee_id,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Cek apakah password cocok dengan password hash yang ada di database
    const match = await bcrypt.compare(password, user.password);  // Menggunakan 'password' sebagai ganti 'password_hash'
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        company_id: user.company_id,
        employee_id: user.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        employee_id: user.employee_id,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW FUNCTION: Force Reset Password ---
const forceResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // 1. Find User by Email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // 2. Hash the New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update the Database
    await user.update({ password: hashedPassword });

    return res.json({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error('Force reset error:', err);
    return res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = {
  register,
  login,
  forceResetPassword // <--- MAKE SURE TO EXPORT THIS
};