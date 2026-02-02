// src/models/attendance.model.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('present', 'annual_leave', 'sick_leave', 'absent'),
      defaultValue: 'present',
    },
    status_approve: {
      type: DataTypes.ENUM('waiting', 'approved', 'rejected'),
      defaultValue: 'waiting',
    },
    work_hours: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // simpan menit atau jam
    },
    location_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    proof_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'attendance',
    underscored: true,
  });

  return Attendance;
};
