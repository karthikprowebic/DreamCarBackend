const { VehicleType } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');
const fileUploadHelper = require('../utils/fileUpload');

// Define the fields that can be searched and sorted
const vehicleTypeFields = ['id', 'name', 'description', 'icon', 'status', 'created_at', 'updated_at'];

class VehicleTypeController {
  // List all vehicle types with pagination, search, and sort
  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    // const pagination = new Pagination(CustomModel, page, limit, searchParams, sortBy, customFields);
    const pagination = new MyPagination (VehicleType, page, limit, searchParams, sortBy, vehicleTypeFields);
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a single vehicle type by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const vehicleType = await VehicleType.findByPk(id);

      if (!vehicleType) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle type not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle type retrieved successfully',
        data: vehicleType
      });
    } catch (error) {
      console.error("Error retrieving vehicle type:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving vehicle type'
      });
    }
  }

  // Create a new vehicle type
  static async store(req, res) {
    try {
      // Debug logging
      console.log('Request Body:', req.body);
      console.log('Request Files:', req.files);

      // Validate required fields
      if (!req.body.name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Name is required'
        });
      }

      let iconPath = null;

      // Handle icon upload if present
      if (req.files?.icon) {
        try {
          const uploadResult = await fileUploadHelper.uploadSingle(req.files.icon, {
            subDirectory: 'vehicle-types',
            prefix: 'icon',
            fileType: 'image'
          });
          iconPath = uploadResult.path;
        } catch (uploadError) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: uploadError.message || 'Error uploading icon'
          });
        }
      }

      // Create the vehicle type
      const vehicleType = await VehicleType.create({
        name: req.body.name,
        description: req.body.description || '',
        icon: iconPath,
        status: req.body.status || 'active'
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Vehicle type created successfully',
        data: vehicleType
      });
    } catch (error) {
      console.error("Error creating vehicle type:", error);
      
      // Clean up uploaded file if there was an error
      if (iconPath) {
        await fileUploadHelper.deleteFile(iconPath);
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating vehicle type'
      });
    }
  }

  // Update a vehicle type
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing vehicle type
      const vehicleType = await VehicleType.findByPk(id);
      if (!vehicleType) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle type not found'
        });
      }

      // Handle icon update if new icon is provided
      let iconPath = vehicleType.icon;
      if (req.files?.icon) {
        try {
          const uploadResult = await fileUploadHelper.updateFile(
            req.files.icon,
            vehicleType.icon,
            {
              subDirectory: 'vehicle-types',
              prefix: 'icon',
              fileType: 'image'
            }
          );
          iconPath = uploadResult.path;
        } catch (uploadError) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: uploadError.message || 'Error uploading icon'
          });
        }
      }

      // Update the vehicle type
      await vehicleType.update({
        name: req.body.name || vehicleType.name,
        description: req.body.description || vehicleType.description,
        icon: iconPath,
        status: req.body.status || vehicleType.status
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle type updated successfully',
        data: vehicleType
      });
    } catch (error) {
      console.error("Error updating vehicle type:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error updating vehicle type'
      });
    }
  }

  // Delete a vehicle type
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing vehicle type
      const vehicleType = await VehicleType.findByPk(id);
      if (!vehicleType) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle type not found'
        });
      }

      // Delete the associated icon file
      if (vehicleType.icon) {
        await fileUploadHelper.deleteFile(vehicleType.icon);
      }

      // Delete the vehicle type
      await vehicleType.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle type deleted successfully'
      });
    } catch (error) {
      console.error("Error deleting vehicle type:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error deleting vehicle type'
      });
    }
  }
}

module.exports = VehicleTypeController;