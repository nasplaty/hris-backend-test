// src/controllers/package.controller.js
const { Package } = require('../models');

const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      order: [['price_per_user', 'ASC']],
    });

    const formattedPackages = packages.map(pkg => {
      let descriptionText = pkg.description || "";
      let featuresList = [];

      // Split by "---" to separate main description from features
      if (descriptionText.includes('---')) {
          const parts = descriptionText.split('---');
          descriptionText = parts[0].trim();
          // Split features by newline, trim whitespace, and remove empty lines
          featuresList = parts[1]
            .split('\n','\r')
            .map(f => f.trim())
            .filter(f => f !== '');
      }

      return {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price_per_user,
          // Send these as separate fields
          desc: descriptionText,
          features: featuresList, 
          level: pkg.level,
          highlight: pkg.level === 'premium'
      };
    });

    return res.json(formattedPackages);
  } catch (err) {
    console.error('getPackages error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

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

module.exports = { createPackage, getPackages };

