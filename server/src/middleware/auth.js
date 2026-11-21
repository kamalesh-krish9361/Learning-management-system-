import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'auralms_super_secret_jwt_key_2026_modern_edtech';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = store.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account no longer exists.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    next();
  });
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};
