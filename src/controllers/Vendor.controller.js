const { Vendor } = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');

// Define the fields that can be searched and sorted
const vendorFields = [
  'company_name',
  'contact_person',
  'email',
  'phone',
  'city',
  'state',
  'status',
  'kyc_verified',
  'rating',
  'total_vehicles',
  'created_at',
  'updated_at'
];

class VendorController {
  // List all vendors with pagination, search, and sort
  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(
      Vendor,
      page,
      limit,
      searchParams,
      sortBy,
      vendorFields
    );
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a single vendor by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: vendor
      });
    } catch (error) {
      console.error("Error retrieving vendor:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error retrieving vendor',
        error: error.message
      });
    }
  }

  // Create a new vendor
  static async store(req, res) {
    try {
      const {
        company_name,
        contact_person,
        email,
        phone,
        alternate_phone,
        address,
        city,
        state,
        pincode,
        gst_number,
        pan_number,
        bank_account_number,
        bank_name,
        ifsc_code,
        commission_percentage,
        status,
        agreement_start_date,
        agreement_end_date,
        kyc_verified
      } = req.body;

      const vendor = await Vendor.create({
        company_name,
        contact_person,
        email,
        phone,
        alternate_phone,
        address,
        city,
        state,
        pincode,
        gst_number,
        pan_number,
        bank_account_number,
        bank_name,
        ifsc_code,
        commission_percentage,
        status: status || 'active',
        agreement_start_date,
        agreement_end_date,
        kyc_verified: kyc_verified || false
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Vendor created successfully',
        data: vendor
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A vendor with this email, GST number, or PAN number already exists'
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

      console.error("Error creating vendor:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating vendor',
        error: error.message
      });
    }
  }

  // Update a vendor
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        company_name,
        contact_person,
        email,
        phone,
        alternate_phone,
        address,
        city,
        state,
        pincode,
        gst_number,
        pan_number,
        bank_account_number,
        bank_name,
        ifsc_code,
        commission_percentage,
        status,
        agreement_start_date,
        agreement_end_date,
        kyc_verified,
        rating,
        total_vehicles
      } = req.body;

      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      await vendor.update({
        company_name,
        contact_person,
        email,
        phone,
        alternate_phone,
        address,
        city,
        state,
        pincode,
        gst_number,
        pan_number,
        bank_account_number,
        bank_name,
        ifsc_code,
        commission_percentage,
        status,
        agreement_start_date,
        agreement_end_date,
        kyc_verified,
        rating,
        total_vehicles
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vendor updated successfully',
        data: vendor
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A vendor with this email, GST number, or PAN number already exists'
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

      console.error("Error updating vendor:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating vendor',
        error: error.message
      });
    }
  }

  // Delete a vendor
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      await vendor.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vendor deleted successfully',
        data: {
          id,
          company_name: vendor.company_name,
          email: vendor.email
        }
      });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error deleting vendor',
        error: error.message
      });
    }
  }
}

module.exports = VendorController;
