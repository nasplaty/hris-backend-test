// src/controllers/payment.controller.js
const { Package, Subscription } = require('../models');
const { Op } = require('sequelize');

// GET /api/payment/packages  - list paket
const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      order: [['price_per_user', 'ASC']],
    });
    return res.json(packages);
  } catch (err) {
    console.error('getPackages error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/payment/subscription/current - langganan aktif untuk company login
const getCurrentSubscription = async (req, res) => {
  try {
    const companyId = req.user.company_id;  // Get the company id from the logged-in user
    const today = new Date().toISOString().slice(0, 10);  // Get today's date in YYYY-MM-DD format

    const sub = await Subscription.findOne({
      where: {
        company_id: companyId,
        start_date: { [Op.lte]: today },  // Subscription start date should be less than or equal to today
        end_date: { [Op.gte]: today },    // Subscription end date should be greater than or equal to today
        status: 'active',  // Only active subscriptions
      },
      include: [{ model: Package }],  // Include the package details
      order: [['created_at', 'DESC']],  // Order by creation date (latest first)
    });

    if (!sub) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    return res.json(sub);
  } catch (err) {
    console.error('getCurrentSubscription error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/payment/subscribe - Admin creates a new subscription
const createSubscription = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const {
      package_id,
      billing_period,  // 'single' or 'monthly'
      team_size_group,
      num_employees,
      tax_rate = 0.11,  // Default tax rate is 11% (can be adjusted)
      start_date,
      end_date,
    } = req.body;

    // Check if the package exists
    const pkg = await Package.findByPk(package_id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    // Check if there's already an active subscription for the company
    const existingSubscription = await Subscription.findOne({
      where: { company_id: companyId, status: 'active' },
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'You already have an active subscription' });
    }

    // Calculate the total cost of the subscription
    const pricePerUser = pkg.price_per_user;
    const subtotal = pricePerUser * num_employees;
    const tax = subtotal * tax_rate;
    const total = subtotal + tax;

    // Create a new subscription
    const subscription = await Subscription.create({
      company_id: companyId,
      package_id,
      billing_period,
      team_size_group,
      num_employees,
      price_per_user: pricePerUser,
      subtotal,
      tax,
      total,
      start_date,
      end_date,
      status: 'active',  // Set the subscription status as active
    });

    return res.status(201).json(subscription);
  } catch (err) {
    console.error('createSubscription error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPackages,
  getCurrentSubscription,
  createSubscription,
};
