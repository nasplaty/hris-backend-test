const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require('./user.model')(sequelize, DataTypes);
const Company = require('./company.model')(sequelize, DataTypes);
const Employee = require('./employee.model')(sequelize, DataTypes);
const Attendance = require('./attendance.model')(sequelize, DataTypes);
const Package = require('./package.model')(sequelize, DataTypes);
const Subscription = require('./subscription.model')(sequelize, DataTypes);

/* ==========================
   RELATION DEFINITIONS
   ========================== */

// COMPANY → USERS
Company.hasMany(User, {
  foreignKey: { name: 'company_id', allowNull: true },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
User.belongsTo(Company, {
  foreignKey: { name: 'company_id', allowNull: true },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

// COMPANY → EMPLOYEES
Company.hasMany(Employee, {
  foreignKey: { name: 'company_id', allowNull: false },
});
Employee.belongsTo(Company, {
  foreignKey: { name: 'company_id', allowNull: false },
});

// EMPLOYEE → ATTENDANCE
Employee.hasMany(Attendance, {
  foreignKey: { name: 'employee_id', allowNull: false },
});
Attendance.belongsTo(Employee, {
  foreignKey: { name: 'employee_id', allowNull: false },
});

// PACKAGE → SUBSCRIPTIONS
Package.hasMany(Subscription, {
  foreignKey: { name: 'package_id', allowNull: false },
});
Subscription.belongsTo(Package, {
  foreignKey: { name: 'package_id', allowNull: false },
});

// COMPANY → SUBSCRIPTIONS
Company.hasMany(Subscription, {
  foreignKey: { name: 'company_id', allowNull: false },
});
Subscription.belongsTo(Company, {
  foreignKey: { name: 'company_id', allowNull: false },
});

module.exports = {
  sequelize,
  User,
  Company,
  Employee,
  Attendance,
  Package,
  Subscription
};
