const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { StatusCodes } = require('http-status-codes');
const { sequelize, Op } = require('../config/database');
const { Order } = require('../models/vehicle.model');

class PaymentController {
  // Create a payment intent
  static async createPayment(req, res) {
    const t = await sequelize.transaction();

    try {
      const { amount, currency = 'usd' } = req.body;

      if (!amount) {
        throw new Error('Amount is required');
      }

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      await t.commit();

      res.status(StatusCodes.OK).json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      await t.rollback();
      console.error('Payment error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Payment creation failed'
      });
    }
  }

  // Get payment status
  static async getPaymentStatus(req, res) {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.status(StatusCodes.OK).json({
        success: true,
        status: paymentIntent.status
      });
    } catch (error) {
      console.error('Get payment status error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Could not retrieve payment status'
      });
    }
  }

  // Webhook handler for Stripe events
  static async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await PaymentController.handlePaymentSuccess(paymentIntent);
          break;
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          await PaymentController.handlePaymentFailure(failedPayment);
          break;
      }

      res.status(StatusCodes.OK).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Webhook Error: ' + error.message
      });
    }
  }

  // Handle successful payment
  static async handlePaymentSuccess(paymentIntent) {
    const t = await sequelize.transaction();

    try {
      const orderId = paymentIntent.metadata.orderId;

      await Order.update(
        {
          payment_status: 'paid',
          status: 'confirmed'
        },
        {
          where: { id: orderId },
          transaction: t
        }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Payment success handling error:', error);
      throw error;
    }
  }

  // Handle failed payment
  static async handlePaymentFailure(paymentIntent) {
    const t = await sequelize.transaction();

    try {
      const orderId = paymentIntent.metadata.orderId;

      await Order.update(
        {
          payment_status: 'failed',
          status: 'pending'
        },
        {
          where: { id: orderId },
          transaction: t
        }
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Payment failure handling error:', error);
      throw error;
    }
  }

  // Get all payments - Admin/Vendor only
  static async getAllPayments(req, res) {
    try {
      const payments = await Order.findAll({
        where: {
          payment_method: 'card',
          payment_intent_id: {
            [Op.not]: null
          }
        },
        attributes: [
          'id',
          'order_number',
          'payment_status',
          'payment_method',
          'payment_intent_id',
          'total_amount',
          'created_at'
        ],
        order: [['created_at', 'DESC']]
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Could not retrieve payments'
      });
    }
  }

  // Get payment history for an order - Admin/Vendor only
  static async getPaymentHistory(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, {
        attributes: [
          'id',
          'order_number',
          'payment_status',
          'payment_method',
          'payment_intent_id',
          'total_amount',
          'created_at'
        ]
      });

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.payment_intent_id) {
        const paymentIntent = await stripe.paymentIntents.retrieve(order.payment_intent_id);
        order.dataValues.payment_details = paymentIntent;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Could not retrieve payment history'
      });
    }
  }
}

module.exports = PaymentController;
