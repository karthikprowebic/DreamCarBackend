const { Category, VehicleType } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');

// Define the fields that can be searched and sorted
const categoryFields = ['name', 'description', 'vehicle_type_id', 'status', 'created_at', 'updated_at'];

class CategoryController {
  // List all categories with pagination, search, and sort
  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(
      Category,      
      page,
      limit,
      searchParams,
      sortBy,
      categoryFields
    );
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);

  }

  // Get a single category by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [{
          model: VehicleType,
          attributes: ['id', 'name', 'description', 'icon']
        }]
      });
      
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Category not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error("Error retrieving category:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving category',
        error: error.message
      });
    }
  }

  // Create a new category
  static async store(req, res) {
    try {
      const { name, description, vehicle_type_id, status } = req.body;

      // Validate vehicle type exists
      const vehicleType = await VehicleType.findByPk(vehicle_type_id);
      if (!vehicleType) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid vehicle type'
        });
      }

      const category = await Category.create({
        name,
        description,
        vehicle_type_id,
        status: status || 'active'
      });

      // Fetch the created category with vehicle type information
      const categoryWithVehicleType = await Category.findByPk(category.id, {
        include: [{
          model: VehicleType,
          attributes: ['id', 'name', 'description', 'icon']
        }]
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Category created successfully',
        data: categoryWithVehicleType
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A category with this name already exists for this vehicle type'
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

      console.error("Error creating category:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating category',
        error: error.message
      });
    }
  }

  // Update a category
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, vehicle_type_id, status } = req.body;

      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Category not found'
        });
      }

      // If vehicle_type_id is being updated, validate it exists
      if (vehicle_type_id && vehicle_type_id !== category.vehicle_type_id) {
        const vehicleType = await VehicleType.findByPk(vehicle_type_id);
        if (!vehicleType) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid vehicle type'
          });
        }
      }

      await category.update({
        name,
        description,
        vehicle_type_id,
        status
      });

      // Fetch the updated category with vehicle type information
      const updatedCategory = await Category.findByPk(id, {
        include: [{
          model: VehicleType,
          attributes: ['id', 'name', 'description', 'icon']
        }]
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A category with this name already exists for this vehicle type'
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

      console.error("Error updating category:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating category',
        error: error.message
      });
    }
  }

  // Delete a category
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [{
          model: VehicleType,
          attributes: ['id', 'name']
        }]
      });
      
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Category not found'
        });
      }

      await category.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Category deleted successfully',
        data: {
          id,
          name: category.name,
          vehicle_type: category.VehicleType.name
        }
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error deleting category',
        error: error.message
      });
    }
  }
}

module.exports = CategoryController;
