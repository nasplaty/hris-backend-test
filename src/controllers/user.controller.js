// src/controllers/user.controller.js
const bcrypt = require('bcrypt');
const { User, Employee, sequelize } = require('../models'); // Import Employee & Sequelize

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hash });

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --- SMART UPDATE PROFILE (Works for Admin & Karyawan) ---
const updateProfile = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    const { role, employee_id } = req.user;
    const payload = req.body;

    // 1. Update Basic User Info (Name, Email)
    // Both Admin and Karyawan can do this
    await User.update(
      { 
        first_name: payload.first_name, 
        last_name: payload.last_name, 
        email: payload.email 
      },
      { where: { id: userId }, transaction: t }
    );

    // 2. If Karyawan (has employee_id), Update Employee Table too
    if (role === 'user' && employee_id) {
        const employee = await Employee.findByPk(employee_id);
        
        if (employee) {
            // SECURITY: Only allow specific fields. 
            // Don't let them change 'position', 'salary', 'grade', etc.
            const allowedUpdates = {
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: payload.email,
                phone: payload.phone,
                gender: payload.gender,
                nik: payload.nik,
                education: payload.education,
                place_of_birth: payload.place_of_birth,
                date_of_birth: payload.date_of_birth,
                bank_name: payload.bank_name,
                bank_account_number: payload.bank_account_number,
                bank_account_holder: payload.bank_account_holder
            };

            await employee.update(allowedUpdates, { transaction: t });
        }
    }

    await t.commit();

    // Fetch fresh data to return
    const updatedUser = await User.findByPk(userId);

    return res.json({ 
        message: 'Profile updated successfully',
        user: updatedUser 
    });

  } catch (err) {
    await t.rollback();
    console.error('updateProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW: GET PROFILE (Unified) ---
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, employee_id } = req.user;

    // 1. If Karyawan, fetch User + Linked Employee Data
    if (role === 'user' && employee_id) {
        const user = await User.findByPk(userId, {
            include: [{ model: Employee, as: 'Employee' }] // Ensure association exists in models
        });
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Merge User login info with Employee HR info
        // Priority: Employee table data overrides User table if duplicate fields exist
        const profileData = {
            ...user.toJSON(),
            ...user.Employee?.toJSON() 
        };
        
        return res.json(profileData);
    }

    // 2. If Admin, just return User data
    const user = await User.findByPk(userId);
    return res.json(user);

  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

module.exports = {
  changePassword,
  updateProfile,
  getProfile
};