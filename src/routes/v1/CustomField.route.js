const express = require('express');
const CustomModelController = require('../../controllers/CustomField.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Routes for custom fields
router.post('', authenticateToken, authorizeRoles( 'admin'),CustomModelController.store);       // Create a new custom field
router.get('',CustomModelController.list);  // Get a custom field by ID
// router.get('', authenticateToken, authorizeRoles( 'admin'),CustomModelController.list);  // Get a custom field by ID
router.get('/:id', authenticateToken, authorizeRoles('admin','vendor'),CustomModelController.show);  // Get a custom field by ID
// router.put('/:id',CustomModelController.deleteStore);  // Get a custom field by ID
router.put('/:id', authenticateToken, authorizeRoles( 'admin'),CustomModelController.update);  // Get a custom field by ID
router.delete('/:id', authenticateToken, authorizeRoles( 'admin'),CustomModelController.delete);  // Get a custom field by ID
router.get('/name/:name', CustomModelController.showMyName);  // Get a custom field by ID

module.exports = router;
