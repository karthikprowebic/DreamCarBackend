const { StatusCodes } = require("http-status-codes");
const { Order, User, Vehicle, sequelize } = require("../models");
const { Op } = require("sequelize");

const getDashboardStats = async (req, res) => {
  try {
    let whereClause = {};
    
    // Add vendor-specific filtering
    if (req.user.role === 'vendor') {
      whereClause.vendor_user_id = req.user.id;
    }

    // Get total orders count with different statuses
    const orderStats = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: whereClause,
      group: ['status']
    });

    // Get total orders count
    const totalOrders = await Order.count({
      where: whereClause
    });

    // Get total revenue
    const revenue = await Order.sum('total_amount', {
      where: {
        ...whereClause,
        status: 'completed' // Only count completed orders for revenue
      }
    });

    // Get orders count by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const monthlyOrders = await Order.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('created_at')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('created_at')), 'year'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        ...whereClause,
        created_at: {
          [Op.gte]: sixMonthsAgo
        }
      },
      group: [
        sequelize.fn('MONTH', sequelize.col('created_at')),
        sequelize.fn('YEAR', sequelize.col('created_at'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('created_at')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('created_at')), 'ASC']
      ]
    });

    // Transform monthly data into a more usable format
    const monthlyData = monthlyOrders.map(mo => {
      const month = mo.getDataValue('month');
      const year = mo.getDataValue('year');
      return {
        month: `${year}-${String(month).padStart(2, '0')}`,
        count: parseInt(mo.getDataValue('count'))
      };
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        orderStats: orderStats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.get('count'));
          return acc;
        }, {}),
        totalOrders,
        totalRevenue: revenue || 0,
        monthlyOrders: monthlyData
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

    // Get user's order statistics
    const orderStats = await Order.findAll({
      where: { 
        user_id: userId,
        status: {
          [Op.in]: orderStatuses
        }
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Create a complete stats object with all statuses
    const completeOrderStats = orderStatuses.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    // Fill in the actual counts
    orderStats.forEach(stat => {
      completeOrderStats[stat.status] = parseInt(stat.get('count'));
    });

    // Get total orders count
    const totalOrders = Object.values(completeOrderStats).reduce((sum, count) => sum + count, 0);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        orderStats: completeOrderStats,
        totalOrders
      }
    });

  } catch (error) {
    console.error('User Dashboard Stats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUserDashboardStats
};