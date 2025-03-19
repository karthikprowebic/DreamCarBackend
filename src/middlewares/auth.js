const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import from models index

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify Bearer token and extract user information
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'No token provided or invalid format',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user and exclude sensitive information
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'mobile_otp'] },
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Token is invalid or expired',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Middleware to check if the user has a specific role
const authorizeRoles = (roles) => {
  // Convert single role to array if string is passed
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: `Access denied: Role ${req.user?.role || 'unknown'} is not authorized`,
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};