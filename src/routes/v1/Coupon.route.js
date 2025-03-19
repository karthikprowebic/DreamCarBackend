const express = require('express');
const CouponController = require('../../controllers/Coupon.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Public routes
router.get('', CouponController.list);  // List all coupons
router.get('/:id', CouponController.show);  // Get a coupon by ID

// Protected routes (admin only)
router.post('', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CouponController.store
);  // Create a new coupon

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CouponController.update
);  // Update a coupon

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CouponController.destroy
);  // Delete a coupon

module.exports = router;
