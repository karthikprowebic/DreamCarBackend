const express = require('express');
const PaymentController = require('../../controllers/Payment.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

// Public routes
// Webhook endpoint (no auth required, uses Stripe signature verification)
router.post('/webhook', 
  express.raw({type: 'application/json'}), 
  PaymentController.handleWebhook
);

// Protected routes - User
router.post('/create-payment',
  authenticateToken,
  PaymentController.createPayment
);

router.get('/status/:paymentIntentId',
  authenticateToken,
  PaymentController.getPaymentStatus
);

// Protected routes - Admin/Vendor
router.get('/all',
  authenticateToken,
  authorizeRoles(['admin', 'vendor']),
  PaymentController.getAllPayments
);

router.get('/:orderId/history',
  authenticateToken,
  authorizeRoles(['admin', 'vendor']),
  PaymentController.getPaymentHistory
);

module.exports = router;
