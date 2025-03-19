const { Vehicle, VehicleType, Category, Brand, VehicleImage, Feature } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');
const { Op } = require('sequelize');
const pick = require('../libs/pick');

// Define the fields that can be searched and sorted
const vehicleFields = ['id', 'name', 'model_year', 'color', 'transmission_type', 'fuel_type', 'daily_rate', 'current_location_address', 'status', 'created_at', 'updated_at'];

class WebController {
  // Get all vehicle types
  static async getVehicleTypes(req, res) {
    try {
      const vehicleTypes = await VehicleType.findAll({
        attributes: ['id', 'name', 'description', 'icon'],
      });
      return res.status(StatusCodes.OK).json({
        success: true,
        data: vehicleTypes
      });
    } catch (error) {
      console.error("Error retrieving vehicle types:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving vehicle types',
        error: error.message
      });
    }
  }

  // Get all brands
  static async getBrands(req, res) {
    try {
      const brands = await Brand.findAll({
        attributes: ['id', 'name', 'logo_url'],
      });
      return res.status(StatusCodes.OK).json({
        success: true,
        data: brands
      });
    } catch (error) {
      console.error("Error retrieving brands:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving brands',
        error: error.message
      });
    }
  }

  // Get categories with optional vehicle type filter
  static async getCategories(req, res) {
    try {
      const filter = { status: 'active' };
      if (req.query.vehicleTypeId) {
        filter.vehicle_type_id = parseInt(req.query.vehicleTypeId, 10);
      }

      const categories = await Category.findAll({
        where: filter,
        attributes: ['id', 'name', 'description'],
        include: [
          {
            model: VehicleType,
            attributes: ['id', 'name', 'icon'],
          },
        ],
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving categories',
        error: error.message
      });
    }
  }

  // Get vehicles with filters and pagination
  static async getVehicles(req, res) {
    try {
      const filter = {}; 
      const options = pick(req.query, ['limit', 'offset', 'sort', 'status']);
      
      // Parse filter parameters
      const filterParams = pick(req.query, ['categoryId', 'brandId', 'vehicleTypeId', 'transmission', 'location', 'minPrice', 'maxPrice', 'status']);
      
      // Only apply status filter if explicitly provided
      if (filterParams.status) filter.status = filterParams.status;
      
      if (filterParams.categoryId) filter.category_id = parseInt(filterParams.categoryId, 10);
      if (filterParams.brandId) filter.brand_id = parseInt(filterParams.brandId, 10);
      if (filterParams.vehicleTypeId) filter.vehicle_type_id = parseInt(filterParams.vehicleTypeId, 10);
      if (filterParams.transmission) filter.transmission_type = filterParams.transmission;
      if (filterParams.location) {
        filter.current_location_address = {
          [Op.like]: `%${filterParams.location}%`
        };
      }

      // Price range filter
      if (filterParams.minPrice) {
        filter.daily_rate = {
          ...filter.daily_rate,
          [Op.gte]: parseFloat(filterParams.minPrice)
        };
      }
      if (filterParams.maxPrice) {
        filter.daily_rate = {
          ...filter.daily_rate,
          [Op.lte]: parseFloat(filterParams.maxPrice)
        };
      }

      // Parse pagination and sorting
      const { limit = 10, offset = 0, sort = 'daily_rate,asc' } = options;
      const [sortField, sortOrder] = sort.split(',');

      const { rows: vehicles, count } = await Vehicle.findAndCountAll({
        where: filter,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            include: [
              {
                model: VehicleType,
                attributes: ['id', 'name', 'icon'],
              },
            ],
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'logo_url'],
          },
        ],
        order: [[sortField, sortOrder.toUpperCase()]],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        data: vehicles,
        pagination: {
          total: count,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Error retrieving vehicles:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving vehicles',
        error: error.message
      });
    }
  }

  // Get vehicle by id
  static async getVehicleById(req, res) {
    try {
      const vehicle = await Vehicle.findOne({
        where: { 
          id: parseInt(req.params.vehicleId, 10), 
          status: 'Available' 
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            include: [
              {
                model: VehicleType,
                attributes: ['id', 'name', 'icon'],
              },
            ],
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'logo_url'],
          },
          {
            model: VehicleImage,
            attributes: ['id', 'image_url', 'image_type', 'is_primary'],
          },
          {
            model: Feature,
            attributes: ['id', 'name', 'icon'],
            through: { attributes: [] }
          }
        ],
      });

      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Transform the response to include primary and additional images
      const vehicleData = vehicle.toJSON();
      const transformedVehicle = {
        ...vehicleData,
        primary_image: vehicleData.VehicleImages?.find(img => img.is_primary)?.image_url || null,
        additional_images: vehicleData.VehicleImages?.filter(img => !img.is_primary).map(img => img.image_url) || [],
        VehicleImages: undefined // Remove the original VehicleImages array
      };

      return res.status(StatusCodes.OK).json({
        success: true,
        data: transformedVehicle
      });
    } catch (error) {
      console.error("Error retrieving vehicle:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving vehicle',
        error: error.message
      });
    }
  }
}

module.exports = WebController;
