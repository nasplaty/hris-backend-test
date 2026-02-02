module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false, // Wajib ada perusahaan
      references: {
        model: 'companies', // Mengacu pada model companies
        key: 'id', // Mengacu pada kolom id di tabel companies
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false, // Wajib
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false, // Wajib
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false, // Wajib
      unique: true, // Email harus unik
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    employment_status: {
      type: DataTypes.ENUM('tetap', 'kontrak', 'magang', 'outsourcing', 'resign'),
      allowNull: true,
    },
    nik: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    place_of_birth: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_account_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_account_holder: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'employees',
    underscored: true,
  });

  // Define relation between Employee and User
  Employee.associate = (models) => {
    Employee.hasOne(models.User, { 
      foreignKey: 'employee_id', 
      as: 'user', 
    });
  };

  return Employee;
};
