const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied. Insufficient permissions.');
    }
    next();
  };
};

module.exports = { authenticate, requireAuth, requireRole };
