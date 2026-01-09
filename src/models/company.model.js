// src/models/company.model.js
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: 'uq_companies_username',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'companies',
    underscored: true,
  });

  return Company;
};
