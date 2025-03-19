const express = require('express');
const OrderController = require('../../controllers/Order.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');
const router = express.Router();

// Public routes
// None - all order routes require authentication

// Protected routes - User
router.post('/', 
  authenticateToken,
  OrderController.createOrder
);

router.get('/my-orders',
  authenticateToken,
  OrderController.getOrders
);

router.get('/:id',
  authenticateToken,
  OrderController.getOrder
);

router.put('/:id/cancel',
  authenticateToken,
  OrderController.cancelOrder
);

// Protected routes - Admin/Vendor
router.get('/',
  authenticateToken,
  authorizeRoles(['admin', 'vendor']),
  OrderController.getAllOrders
);

router.get('/vendor/orders',
  authenticateToken,
  authorizeRoles(['admin', 'vendor']),
  OrderController.getAllVendorOrders
);

router.put('/:id/status',
  authenticateToken,
  authorizeRoles(['admin', 'vendor']),
  OrderController.updateOrderStatus
);

module.exports = router;
