const sequelize = require('../config/db'); // Ensure this path matches your DB config
const { DataTypes } = require('sequelize');

// 1. Import Models
const User = require('./user.model')(sequelize, DataTypes);
const Company = require('./company.model')(sequelize, DataTypes);
const Employee = require('./employee.model')(sequelize, DataTypes);
const Attendance = require('./attendance.model')(sequelize, DataTypes);
const Package = require('./package.model')(sequelize, DataTypes);
const Subscription = require('./subscription.model')(sequelize, DataTypes);

// 2. DEFINE ASSOCIATIONS (Standardized)

// --- Company & User ---
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

// --- Company & Employee ---
Company.hasMany(Employee, { foreignKey: 'company_id' });
Employee.belongsTo(Company, { foreignKey: 'company_id' });

// --- Employee & User (One-to-One) ---
Employee.hasOne(User, { foreignKey: 'employee_id' });
User.belongsTo(Employee, { foreignKey: 'employee_id' });

// --- Employee & Attendance (THE FIX) ---
// Using simple string 'employee_id' fixes the 500 Error
Employee.hasMany(Attendance, { foreignKey: 'employee_id' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id' });

// --- Package & Subscription ---
Package.hasMany(Subscription, { foreignKey: 'package_id' });
Subscription.belongsTo(Package, { foreignKey: 'package_id' });

// --- Company & Subscription ---
Company.hasMany(Subscription, { foreignKey: 'company_id' });
Subscription.belongsTo(Company, { foreignKey: 'company_id' });

// 3. Export
module.exports = {
  sequelize,
  User,
  Company,
  Employee,
  Attendance,
  Package,
  Subscription
};