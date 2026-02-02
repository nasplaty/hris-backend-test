module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price_per_user: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    // ✅ tambahkan durasi
    duration_months: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    min_employees: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    max_employees: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM('standard', 'premium', 'ultra'),
      allowNull: false,
      defaultValue: 'standard',
    },
  }, {
    tableName: 'packages',
    underscored: true,
  });

  Package.associate = (models) => {
    Package.hasMany(models.Subscription, { foreignKey: 'package_id', as: 'subscriptions' });
  };

  return Package;
};
