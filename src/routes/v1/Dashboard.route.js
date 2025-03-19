const express = require('express');
const DashboardController = require('../../controllers/Dashboard.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Protected routes (admin and vendor only)
router.get('/stats', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']), 
  DashboardController.getDashboardStats
);

router.get('/user/stats', authenticateToken,DashboardController.getUserDashboardStats);

module.exports = router;