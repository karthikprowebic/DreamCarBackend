const { Coupon, VehicleType, Category, Brand } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');

// Define the fields that can be searched and sorted
const couponFields = [
  'code', 'type', 'value', 'start_date', 'end_date', 
  'min_rental_days', 'max_rental_days', 'usage_limit', 
  'used_count', 'vehicle_type_id', 'category_id', 'brand_id',
  'min_amount', 'max_discount_amount', 'description', 'status',
  'created_at', 'updated_at'
];

class CouponController {
  // List all coupons with pagination, search, and sort
  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(
      Coupon,      
      page,
      limit,
      searchParams,
      sortBy,
      couponFields
    );
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a single coupon by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByPk(id, {
        include: [
          {
            model: VehicleType,
            attributes: ['id', 'name', 'description', 'icon']
          },
          {
            model: Category,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'description', 'logo']
          }
        ]
      });
      
      if (!coupon) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: coupon
      });
    } catch (error) {
      console.error("Error retrieving coupon:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving coupon',
        error: error.message
      });
    }
  }

  // Create a new coupon
  static async store(req, res) {
    try {
      const {
        code, type, value, start_date, end_date,
        min_rental_days, max_rental_days, usage_limit,
        vehicle_type_id, category_id, brand_id,
        min_amount, max_discount_amount, description, status
      } = req.body;

      // Validate related entities if provided
      if (vehicle_type_id) {
        const vehicleType = await VehicleType.findByPk(vehicle_type_id);
        if (!vehicleType) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid vehicle type'
          });
        }
      }

      if (category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid category'
          });
        }
      }

      if (brand_id) {
        const brand = await Brand.findByPk(brand_id);
        if (!brand) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid brand'
          });
        }
      }

      const coupon = await Coupon.create({
        code,
        type,
        value,
        start_date,
        end_date,
        min_rental_days,
        max_rental_days,
        usage_limit,
        vehicle_type_id,
        category_id,
        brand_id,
        min_amount,
        max_discount_amount,
        description,
        status: status || 'active'
      });

      // Fetch the created coupon with related information
      const couponWithRelations = await Coupon.findByPk(coupon.id, {
        include: [
          {
            model: VehicleType,
            attributes: ['id', 'name',]
          },
          {
            model: Category,
            attributes: ['id', 'name', ]
          },
          {
            model: Brand,
            attributes: ['id', 'name' ]
          }
        ]
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Coupon created successfully',
        data: couponWithRelations
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A coupon with this code already exists'
        });
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      console.error("Error creating coupon:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating coupon',
        error: error.message
      });
    }
  }

  // Update a coupon
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        code, type, value, start_date, end_date,
        min_rental_days, max_rental_days, usage_limit,
        vehicle_type_id, category_id, brand_id,
        min_amount, max_discount_amount, description, status
      } = req.body;

      const coupon = await Coupon.findByPk(id);
      
      if (!coupon) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      // Validate related entities if being updated
      if (vehicle_type_id && vehicle_type_id !== coupon.vehicle_type_id) {
        const vehicleType = await VehicleType.findByPk(vehicle_type_id);
        if (!vehicleType) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid vehicle type'
          });
        }
      }

      if (category_id && category_id !== coupon.category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid category'
          });
        }
      }

      if (brand_id && brand_id !== coupon.brand_id) {
        const brand = await Brand.findByPk(brand_id);
        if (!brand) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid brand'
          });
        }
      }

      await coupon.update({
        code,
        type,
        value,
        start_date,
        end_date,
        min_rental_days,
        max_rental_days,
        usage_limit,
        vehicle_type_id,
        category_id,
        brand_id,
        min_amount,
        max_discount_amount,
        description,
        status
      });

      // Fetch the updated coupon with related information
      const updatedCoupon = await Coupon.findByPk(id, {
        include: [
          {
            model: VehicleType,
            attributes: ['id', 'name', 'description', 'icon']
          },
          {
            model: Category,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'description', 'logo']
          }
        ]
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Coupon updated successfully',
        data: updatedCoupon
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A coupon with this code already exists'
        });
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      console.error("Error updating coupon:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating coupon',
        error: error.message
      });
    }
  }

  // Delete a coupon
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByPk(id);
      
      if (!coupon) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Coupon not found'
        });
      }

      await coupon.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Coupon deleted successfully',
        data: {
          id,
          code: coupon.code
        }
      });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error deleting coupon',
        error: error.message
      });
    }
  }
}

module.exports = CouponController;
