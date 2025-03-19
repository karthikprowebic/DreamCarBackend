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

// Public routes (e.g., registration and login)
router.post('/user/register', AuthController.mobileRegister);
router.post('/register',validate(registerSchema), AuthController.register);
router.post('/user/login',AuthController.mobileLogin);
router.post('/user/otp', AuthController.checkMobileAndGenerateOtp);
router.post('/login', validate(loginSchema),AuthController.login);
router.get('/userinfo',authenticateToken,AuthController.user);
router.put('/user_profile/:id',authenticateToken,AuthController.userUpdate);
router.put('/user_pass_change/:id',authenticateToken,AuthController.changeUserPassword);



// Protected routes (require login and role-based access)
//router.get('/admin/orders', authenticateToken, authorizeRoles('admin'), OrderController.adminList); // Admin-only route
//router.get('/user/orders', authenticateToken, authorizeRoles('user', 'admin'), OrderController.userOrders); // User or admin route
router.post('/change-password/:userId', authenticateToken, authorizeRoles('user', 'admin'), AuthController.changePassword); // Accessible to both user and admin

module.exports = router;
