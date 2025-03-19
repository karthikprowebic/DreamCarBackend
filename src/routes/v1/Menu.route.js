const express = require('express');
const MenuController = require('../../controllers/Menu.controller');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

// Get menu items by role
router.get('/role/:role', authenticateToken, authorizeRoles('admin'), MenuController.getByRole);

// Create a new menu item
router.post('/', authenticateToken, authorizeRoles('admin'), MenuController.create);

// Update menu item by ID
router.put('/:id', authenticateToken, authorizeRoles('admin'), MenuController.update);

// Update menu display status by ID
router.patch('/:id/display', authenticateToken, authorizeRoles('admin'), MenuController.updateDisplay);

// Delete menu item by ID
router.delete('/:id', authenticateToken, authorizeRoles('admin'), MenuController.delete);

module.exports = router;