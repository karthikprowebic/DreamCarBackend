const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/Auth.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const validate = require('../../middlewares/validation');
const {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} = require('../../validations/Auth.validator');

router.get('',  AuthController.list); // Accessible to both user and admin
// router.get('', authenticateToken, authorizeRoles( 'admin'), AuthController.list); // Accessible to both user and admin
router.post('',AuthController.createNewUser); // Accessible to both user and admin
router.get('/:id',AuthController.show); // Accessible to both user and admin
router.put('/:id',AuthController.update); // Accessible to both user and admin
router.put('/change-password/:userId', authenticateToken, authorizeRoles(['admin', 'vendor']), AuthController.changePassword); // Accessible to both user and admin
router.put('/profile/:id',authenticateToken,authorizeRoles( 'admin'),AuthController.updateProfile);
module.exports = router;
