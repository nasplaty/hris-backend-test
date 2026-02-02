// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.role) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      // cek role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      // aturan tambahan: admin_company wajib punya company_id
      if (decoded.role === 'admin_company' && !decoded.company_id) {
        return res.status(403).json({ message: 'Forbidden: admin_company harus punya company_id' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
