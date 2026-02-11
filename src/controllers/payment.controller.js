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
    // Safety check: ensure req.user exists
    if (!req.user || !req.user.company_id) {
        return res.status(401).json({ message: 'Unauthorized: Company ID missing' });
    }

    const companyId = req.user.company_id;
    const today = new Date().toISOString().slice(0, 10);

    const sub = await Subscription.findOne({
      where: {
        company_id: companyId,
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
        status: 'active',
      },
      include: [{ model: Package }],
      order: [['created_at', 'DESC']],
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
//
// POST /api/payment/subscribe - Admin creates a new subscription
// const createSubscription = async (req, res) => {
//   try {
//     // Safety check
//     if (!req.user || !req.user.company_id) {
//         return res.status(401).json({ message: 'Unauthorized: Company ID missing' });
//     }

//     const companyId = req.user.company_id;
//     const {
//       package_id,
//       billing_period, 
//       number_of_employees, // Matches your Postman JSON
//       tax_rate = 0.11,     // Default 11%
//     } = req.body;

//     // 1. Validate Input
//     if (!package_id || !number_of_employees) {
//         return res.status(400).json({ message: "Package ID and Number of Employees are required" });
//     }

//     // 2. Check Package
//     const pkg = await Package.findByPk(package_id);
//     if (!pkg) return res.status(404).json({ message: 'Package not found' });

//     // 3. Handle Existing Subscription (Upgrade/Downgrade Logic)
//     const existingSubscription = await Subscription.findOne({
//       where: { company_id: companyId, status: 'active' },
//     });

//     if (existingSubscription) {
//       // OPTION A: Block them (Old behavior)
//       // return res.status(400).json({ message: 'You already have an active subscription' });

//       // OPTION B: Auto-Expire the old one (Upgrade behavior)
//       await existingSubscription.update({ 
//         status: 'expired',
//         end_date: new Date() // End it today
//       });
//     }

//     // 4. Calculate Dates (The missing piece!)
//     const start_date = new Date();
//     const end_date = new Date();

//     if (billing_period === 'Yearly') {
//         end_date.setFullYear(end_date.getFullYear() + 1);
//     } else {
//         // Default to Monthly if not Yearly
//         end_date.setMonth(end_date.getMonth() + 1);
//     }

//     // 5. Calculate Costs
//     const pricePerUser = parseFloat(pkg.price_per_user);
//     const subtotal = pricePerUser * number_of_employees;
//     const tax = subtotal * tax_rate;
//     const total = subtotal + tax;

//     // 6. Create Subscription
//     const subscription = await Subscription.create({
//       company_id: companyId,
//       package_id,
//       billing_period: billing_period || 'Monthly',
//       team_size_group: 'Standard', // Optional default
      
//       // MAP the variable names correctly here:
//       num_employees: number_of_employees, 
      
//       price_per_user: pricePerUser,
//       subtotal,
//       tax,
//       total,
      
//       // Use the calculated dates
//       start_date,
//       end_date,
      
//       status: 'active',
//     });

//     return res.status(201).json(subscription);
//   } catch (err) {
//     console.error('createSubscription error:', err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

const createSubscription = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { package_id, billing_period, num_employees } = req.body;

    const pkg = await Package.findByPk(package_id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    if (billing_period === 'Yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // Calculate Totals
    const price = parseFloat(pkg.price_per_user);
    const subtotal = price * num_employees;
    const tax = 0; // Or your tax logic
    const total = subtotal + tax;

    // Create
    const sub = await Subscription.create({
        company_id: companyId,
        package_id,
        billing_period,
        start_date: startDate,
        end_date: endDate,
        num_employees,
        price_per_user: price,
        subtotal,
        tax,
        total,
        status: 'active',
        team_size_group: num_employees > 50 ? '50-100' : '1-50'
    });

    return res.status(201).json({ message: 'Subscription created', subscription: sub });

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