// src/controllers/user.controller.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Pastikan password lama cocok dengan yang ada di database
    const user = await User.findByPk(req.user.id);  // req.user.id adalah user yang sudah login
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

    // Update dengan password baru
    const hash = await bcrypt.hash(newPassword, 10);
    await user.update({ password_hash: hash });

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  changePassword
};
