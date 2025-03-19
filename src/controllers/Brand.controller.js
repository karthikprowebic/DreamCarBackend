const { Brand } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');
const fileUploadHelper = require('../utils/fileUpload');

// Define the fields that can be searched and sorted
const brandFields = ['id', 'name', 'logo_url',  'created_at', 'updated_at'];

class BrandController {
  // List all brands with pagination, search, and sort
  static async index(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(Brand, page, limit, searchParams, sortBy, brandFields);
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a single brand by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const brand = await Brand.findByPk(id);

      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Brand not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Brand retrieved successfully',
        data: brand
      });
    } catch (error) {
      console.error("Error retrieving brand:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving brand'
      });
    }
  }

  // Create a new brand
  static async store(req, res) {
    let logoPath = null;
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

      // Handle logo upload if present
      if (req.files?.logo) {
        try {
          const uploadResult = await fileUploadHelper.uploadSingle(req.files.logo, {
            subDirectory: 'brands',
            prefix: 'logo',
            fileType: 'image'
          });
          logoPath = uploadResult.path;
        } catch (uploadError) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: uploadError.message || 'Error uploading logo'
          });
        }
      }

      // Create the brand
      const brand = await Brand.create({
        name: req.body.name,
        description: req.body.description || '',
        logo_url: logoPath,
        website: req.body.website || '',
        status: req.body.status || 'active'
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Brand created successfully',
        data: brand
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      
      // Clean up uploaded file if there was an error
      if (logoPath) {
        await fileUploadHelper.deleteFile(logoPath);
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating brand'
      });
    }
  }

  // Update a brand
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing brand
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Brand not found'
        });
      }

      // Handle logo update if new logo is provided
      let logoPath = brand.logo_url;
      if (req.files?.logo) {
        try {
          const uploadResult = await fileUploadHelper.updateFile(
            req.files.logo,
            brand.logo_url,
            {
              subDirectory: 'brands',
              prefix: 'logo',
              fileType: 'image'
            }
          );
          logoPath = uploadResult.path;
        } catch (uploadError) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: uploadError.message || 'Error uploading logo'
          });
        }
      }

      // Update the brand
      await brand.update({
        name: req.body.name || brand.name,
        description: req.body.description || brand.description,
        logo_url: logoPath,
        website: req.body.website || brand.website,
        status: req.body.status || brand.status
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Brand updated successfully',
        data: brand
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error updating brand'
      });
    }
  }

  // Delete a brand
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing brand
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Brand not found'
        });
      }

      // Delete the associated logo file
      if (brand.logo_url) {
        await fileUploadHelper.deleteFile(brand.logo_url);
      }

      // Delete the brand
      await brand.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Brand deleted successfully'
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error deleting brand'
      });
    }
  }
}

module.exports = BrandController;
