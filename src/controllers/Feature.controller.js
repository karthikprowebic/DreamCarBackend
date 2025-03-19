const { Feature } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');
const fileUploadHelper = require('../utils/fileUpload');

// Define the fields that can be searched and sorted
const featureFields = ['id', 'name', 'icon', 'vehicle_type_id', 'created_at', 'updated_at'];

class FeatureController {
  // List all features with pagination, search, and sort
  static async index(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(Feature, page, limit, searchParams, sortBy, featureFields);
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a single feature by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const feature = await Feature.findByPk(id);

      if (!feature) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Feature not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Feature retrieved successfully',
        data: feature
      });
    } catch (error) {
      console.error("Error retrieving feature:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving feature'
      });
    }
  }

  // Create a new feature
  static async store(req, res) {
    let iconPath = null;
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

      if (!req.body.vehicle_type_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Vehicle type is required'
        });
      }

      // Handle icon upload if present
      if (req.files?.icon) {
        try {
          const uploadResult = await fileUploadHelper.uploadSingle(req.files.icon, {
            subDirectory: 'features',
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

      // Create the feature
      const feature = await Feature.create({
        name: req.body.name,
        vehicle_type_id: req.body.vehicle_type_id,
        icon: iconPath
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Feature created successfully',
        data: feature
      });
    } catch (error) {
      console.error("Error creating feature:", error);
      
      // Clean up uploaded file if there was an error
      if (iconPath) {
        await fileUploadHelper.deleteFile(iconPath);
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating feature'
      });
    }
  }

  // Update a feature
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing feature
      const feature = await Feature.findByPk(id);
      if (!feature) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Feature not found'
        });
      }

      // Handle icon update if new icon is provided
      let iconPath = feature.icon;
      if (req.files?.icon) {
        try {
          const uploadResult = await fileUploadHelper.updateFile(
            req.files.icon,
            feature.icon,
            {
              subDirectory: 'features',
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

      // Update the feature
      await feature.update({
        name: req.body.name || feature.name,
        vehicle_type_id: req.body.vehicle_type_id || feature.vehicle_type_id,
        icon: iconPath
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Feature updated successfully',
        data: feature
      });
    } catch (error) {
      console.error("Error updating feature:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error updating feature'
      });
    }
  }

  // Delete a feature
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing feature
      const feature = await Feature.findByPk(id);
      if (!feature) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Feature not found'
        });
      }

      // Delete the associated icon file
      if (feature.icon) {
        await fileUploadHelper.deleteFile(feature.icon);
      }

      // Delete the feature
      await feature.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      console.error("Error deleting feature:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error deleting feature'
      });
    }
  }
}

module.exports = FeatureController;
