const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/auth.routes');
const employeeRoutes = require('./src/routes/employee.routes');
const attendanceRoutes = require('./src/routes/attendance.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');  // Import admin route

// Middleware untuk auth
const authMiddleware = require('./src/middlewares/auth.middleware');

const app = express();

// CORS middleware (untuk akses dari frontend)
app.use(cors());

// Middleware untuk body parsing
app.use(express.json());

// Rute untuk login dan register
app.use('/api/auth', authRoutes);

// Rute untuk Employee dan fitur terkait
app.use('/api/employees', authMiddleware(['admin_company', 'user']), employeeRoutes);

// Rute untuk Attendance, hanya admin dan user yang bisa akses
app.use('/api/attendance', authMiddleware(['admin_company', 'user']), attendanceRoutes);

// Rute untuk Payment dan Subscription, admin yang bisa akses
app.use('/api/payment', authMiddleware('admin_company'), paymentRoutes);

// Rute untuk Update Password
app.use('/api/user', authMiddleware('user'), userRoutes);

// Rute untuk Admin (System & Company)
app.use('/api/admin', authMiddleware(['admin_system', 'admin_company']), adminRoutes);  // Admin routes

// Endpoint root untuk memastikan API berjalan
app.get('/', (req, res) => {
  res.json({ message: 'HRIS API is running' });
});

// Set port dan mulai server
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing DB:', err);
    process.exit(1);
  });
