const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../config/database');
const {
  Vehicle,
  Order,
  OrderItem,
  VehicleType
} = require('../models/vehicle.model');
const User = require('../models/User.model');

class OrderController {
  static calculateSubtotal(item, vehicle) {
    const rate = item.rate_type === 'daily' ? vehicle.daily_rate : vehicle.hourly_rate;
    return rate * item.total_units * (item.quantity || 1);
  }

  static calculateInsuranceFee(item, vehicle) {
    if (!item.with_insurance) return 0;
    const insuranceRate = vehicle.insurance_fee_per_day;
    const days = item.rate_type === 'daily' ? 
      item.total_units : 
      Math.ceil(item.total_units / 24);
    return insuranceRate * days * (item.quantity || 1);
  }

  static calculateDriverFee(item, vehicle) {
    if (!item.with_driver) return 0;
    const driverRate = vehicle.driver_rate_per_day;
    const days = item.rate_type === 'daily' ? 
      item.total_units : 
      Math.ceil(item.total_units / 24);
    return driverRate * days * (item.quantity || 1);
  }

  // Create a new order
  static async createOrder(req, res) {
    let t;

    try {
      t = await sequelize.transaction();

      const { 
        vehicle_id,
        pickup_date,
        return_date,
        pickup_location,
        return_location,
        driver_required = false,
        insurance_required = false,
        payment_method = 'cash',
        total_amount,
        notes = ''
      } = req.body;

      // Validate required fields
      if (!vehicle_id || !pickup_date || !return_date || !pickup_location || !return_location) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Missing required fields',
          error: 'vehicle_id, pickup_date, return_date, pickup_location, and return_location are required'
        });
      }

      // Get vehicle details
      const vehicle = await Vehicle.findByPk(vehicle_id);
      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found',
          error: `Vehicle with id ${vehicle_id} not found`
        });
      }

      // Validate and parse dates
      const startDate = new Date(pickup_date);
      const endDate = new Date(return_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid date format',
          error: 'pickup_date and return_date must be valid ISO date strings'
        });
      }

      const now = new Date();
      if (startDate < now) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid pickup date',
          error: 'Pickup date must be in the future'
        });
      }

      if (startDate >= endDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid date range',
          error: 'return_date must be after pickup_date'
        });
      }

      // Calculate rental days and fees
      const diffTime = Math.abs(endDate - startDate);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const daily_rate = vehicle.daily_rate;
      const subtotal = daily_rate * days;
      const driver_fee = driver_required ? (vehicle.driver_rate_per_day * days) : 0;
      const insurance_fee = insurance_required ? (vehicle.insurance_fee_per_day * days) : 0;
      const calculated_total = subtotal + driver_fee + insurance_fee;

      // Verify total amount with a small tolerance for floating-point arithmetic
      if (Math.abs(calculated_total - total_amount) > 0.01) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Total amount mismatch',
          error: `Expected ${calculated_total.toFixed(2)}, but received ${total_amount}`,
          breakdown: {
            days,
            daily_rate,
            subtotal,
            driver_fee,
            insurance_fee,
            calculated_total
          }
        });
      }

      // Generate unique order number (YYYYMMDD-XXXX format)
      const orderDate = new Date();
      const orderPrefix = orderDate.toISOString().slice(0,10).replace(/-/g,'');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const order_number = `${orderPrefix}-${randomSuffix}`;

      // Create order
      const order = await Order.create({
        user_id: req.user.id,
        order_number,
        start_date: startDate,
        end_date: endDate,
        pickup_location,
        dropoff_location: return_location,
        payment_method,
        payment_status: 'pending',
        status: 'pending',
        // start
        total_amount: req.body.total_amount,
        vendor_user_id: req.body.vendor_user_id,
        // vendor_id: req.body.vendor_id,

        // total_amount: calculated_total,
        driver_required,
        insurance_required,
        notes,
        created_by: req.user.id,
        updated_by: req.user.id
      }, { transaction: t });

      // Create order item
      await OrderItem.create({
        order_id: order.id,
        vehicle_id,
        vehicle_type_id: vehicle.vehicle_type_id,
        quantity: 1,
        rate_type: 'daily',
        rate_amount: daily_rate,
        total_units: days,
        subtotal,
        insurance_fee,
        driver_fee,
        status: 'pending',
        created_by: req.user.id,
        updated_by: req.user.id
      }, { transaction: t });

      await t.commit();

      // Fetch the complete order with its items
      const completeOrder = await Order.findOne({
        where: { id: order.id },
        include: [{
          model: OrderItem,
          include: [{
            model: Vehicle,
            attributes: ['id', 'name', 'main_image']
          }]
        }]
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Order created successfully',
        data: completeOrder
      });

    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error('Error creating order:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating order',
        error: error.message
      });
    }
  }

  // Get all orders for a user
  static async getOrders(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        where: { user_id: req.user.id },
        include: [{
          model: OrderItem,
          as: 'OrderItems',
          separate: true,
          include: {
            model: Vehicle,
            as: 'Vehicle',
            attributes: ['id', 'name', 'main_image']
          }
        }],
        order: [['created_at', 'DESC']]
      };

      const orders = await Order.findAndCountAll(options);

      // Transform the response
      const transformedOrders = orders.rows.map(order => ({
        ...order.toJSON(),
        OrderItems: order.OrderItems.map(item => ({
          ...item.toJSON(),
          Vehicle: item.Vehicle
        }))
      }));

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          orders: transformedOrders,
          total: orders.count,
          totalPages: Math.ceil(orders.count / limit),
          currentPage: parseInt(page)
        }
      });

    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  }

  // all order for vendor and admin
  static async getAllVendorOrders(req, res) {
    try {
      const { page = 1, limit = 5, status } = req.query; 

      // Base options for pagination and includes
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        include: [{
          model: OrderItem,
          as: 'OrderItems',
          separate: true,
          include: {
            model: Vehicle,
            as: 'Vehicle',
            attributes: ['id', 'name', 'main_image']
          }
        }],
        order: [['created_at', 'DESC']]
      };

      // Base query
      let query = {};

      // Add status filter if provided
      if (status && ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        query.status = status;
      }

      // Add vendor/admin specific filtering
      if (req.user.role === 'vendor') {
        query.vendor_user_id = req.user.id;
      }

      const orders = await Order.findAndCountAll({ ...options, where: query });

      // Transform the response
      const transformedOrders = orders.rows.map(order => ({
        ...order.toJSON(),
        OrderItems: order.OrderItems.map(item => ({
          ...item.toJSON(),
          Vehicle: item.Vehicle
        }))
      }));

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          orders: transformedOrders,
          total: orders.count,
          totalPages: Math.ceil(orders.count / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  }

  // Get a specific order
  static async getOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { 
          id,
          user_id: req.user.id 
        },
        include: [{
          model: OrderItem,
          as: 'OrderItems',
          separate: true,
          include: {
            model: Vehicle,
            as: 'Vehicle',
            attributes: ['id', 'name', 'main_image', 'daily_rate', 'driver_rate_per_day']
          }
        }]
      });

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Transform the response
      const transformedOrder = {
        ...order.toJSON(),
        OrderItems: order.OrderItems.map(item => ({
          ...item.toJSON(),
          Vehicle: item.Vehicle
        }))
      };

      return res.status(StatusCodes.OK).json({
        success: true,
        data: transformedOrder
      });

    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  }

  // Cancel order
  static async cancelOrder(req, res) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { 
          id,
          user_id: req.user.id
        }
      });

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.status !== 'pending') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Only pending orders can be cancelled'
        });
      }

      await order.update({
        status: 'cancelled',
        cancellation_reason: req.body.reason || 'Cancelled by user'
      }, { transaction: t });

      await t.commit();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Order cancelled successfully'
      });

    } catch (error) {
      await t.rollback();
      console.error('Error cancelling order:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error cancelling order',
        error: error.message
      });
    }
  }

  // Get all orders (admin/vendor)
  static async getAllOrders(req, res) {
    try {
      console.log('req.user.role', req.user.role);
      
      const { page = 1, limit = 10, status, payment_status } = req.query;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (payment_status) where.payment_status = payment_status;
      if (req.user.role === 'vendor') where.vendor_user_id = req.user.id;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        where,
        include: [{
          model: OrderItem,
          as: 'OrderItems',
          separate: true,
          include: {
            model: Vehicle,
            as: 'Vehicle',
            attributes: ['id', 'name',  'main_image', 'vendor_id']
          }
        }, {
          model: User,
          as: 'User',
          attributes: ['id',  'email', 'full_name']
        }],
        order: [['created_at', 'DESC']]
      };

      const orders = await Order.findAndCountAll(options);

      // Transform the response
      const transformedOrders = orders.rows.map(order => ({
        ...order.toJSON(),
        OrderItems: order.OrderItems.map(item => ({
          ...item.toJSON(),
          Vehicle: item.Vehicle
        })),
        User: order.User
      }));

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          orders: transformedOrders,
          total: orders.count,
          totalPages: Math.ceil(orders.count / limit),
          currentPage: parseInt(page)
        }
      });

    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  }

  // Update order status (admin/vendor)
  static async updateOrderStatus(req, res) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { status, payment_status, notes } = req.body;

      const order = await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          as: 'OrderItems',
          include: [{ model: Vehicle }]
        }]
      });

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Order not found'
        });
      }

      // If vendor, verify they own the vehicle
      if (req.user.role === 'vendor') {
        const orderVehicle = order.OrderItems[0].Vehicle;
        if (orderVehicle.vendor_user_id !== req.user.id) {
          return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'You do not have permission to update this order'
          });
        }
      }

      // Validate status transition
      const validTransitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };

      if (status && !validTransitions[order.status].includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: `Cannot transition from ${order.status} to ${status}`
        });
      }

      // Update order
      const updates = {};
      if (status) updates.status = status;
      if (payment_status) updates.payment_status = payment_status;
      if (notes) updates.notes = notes;

      await order.update(updates, { transaction: t });

      // If status is updated, update order items too
      if (status) {
        await OrderItem.update(
          { status },
          { 
            where: { order_id: id },
            transaction: t 
          }
        );
      }

      await t.commit();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Order status updated successfully',
        data: await Order.findByPk(id, {
          include: [{
            model: OrderItem,
            as: 'OrderItems',
            include: [{ 
              model: Vehicle,
              as: 'Vehicle',
              attributes: ['id', 'name', 'main_image']
            }]
          }]
        })
      });

    } catch (error) {
      await t.rollback();
      console.error('Error updating order status:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating order status',
        error: error.message
      });
    }
  }
}

module.exports = OrderController;
