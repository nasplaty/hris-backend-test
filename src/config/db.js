// src/config/db.js
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000, // Tambahkan ini agar TiDB tahu pintu masuknya
    dialect: 'mysql',
    logging: false, 
    timezone: '+07:00', 
    
    // 👇 TAMBAHKAN BAGIAN INI UNTUK KEAMANAN SSL TIDB 👇
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    }
    // 👆 SAMPAI SINI 👆
  }
);

module.exports = sequelize;