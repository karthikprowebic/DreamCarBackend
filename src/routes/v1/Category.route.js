const express = require('express');
const CategoryController = require('../../controllers/Category.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Public routes
router.get('', CategoryController.list);  // List all categories
router.get('/:id', CategoryController.show);  // Get a category by ID

// Protected routes (admin only)
router.post('', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CategoryController.store
);  // Create a new category

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CategoryController.update
);  // Update a category

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  CategoryController.destroy
);  // Delete a category

module.exports = router;
