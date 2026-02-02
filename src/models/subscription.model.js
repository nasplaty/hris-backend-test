// src/models/subscription.model.js
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    billing_period: {
      type: DataTypes.ENUM('single', 'monthly'),
      allowNull: false,
    },
    team_size_group: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    num_employees: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    price_per_user: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'pending'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'subscriptions',
    underscored: true,
  });

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.Package, { foreignKey: 'package_id' });
    Subscription.belongsTo(models.Company, { foreignKey: 'company_id' });
  };

  return Subscription;
};
