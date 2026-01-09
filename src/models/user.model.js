module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: 'uq_users_email',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {  
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin_system', 'admin_company', 'user'),
      defaultValue: 'user',
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,  // relasi dengan perusahaan
      allowNull: true,
    },
  }, {
    tableName: 'users',
    underscored: true,
  });

  // Relasi antara User dan Employee
  User.associate = (models) => {
    User.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    User.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };

  return User;
};
