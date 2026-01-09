// src/controllers/package.controller.js
const { Package } = require('../models');

const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      price_per_user,
      duration_months,
      level = 'standard',
      min_employees = null,
      max_employees = null,
    } = req.body;

    if (!name || !price_per_user || !duration_months) {
      return res.status(400).json({
        message: 'Field wajib: name, price_per_user, duration_months',
      });
    }

    if (Number(price_per_user) <= 0) {
      return res.status(400).json({ message: 'price_per_user harus > 0' });
    }

    if (Number(duration_months) <= 0) {
      return res.status(400).json({ message: 'duration_months harus > 0' });
    }

    const newPackage = await Package.create({
      name,
      description: description || null,
      price_per_user,
      duration_months,
      level,
      min_employees,
      max_employees,
    });

    return res.status(201).json(newPackage);
  } catch (err) {
    console.error('createPackage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPackage };
