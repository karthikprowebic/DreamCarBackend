const express = require('express');
const VendorController = require('../../controllers/Vendor.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Public routes
router.get('', VendorController.list);  // List all vendors
router.get('/:id', VendorController.show);  // Get a vendor by ID

// Protected routes (admin only)
router.post('', 
  authenticateToken, 
  authorizeRoles('admin'), 
  VendorController.store
);  // Create a new vendor

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  VendorController.update
);  // Update a vendor

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  VendorController.destroy
);  // Delete a vendor

module.exports = router;
