const { 
  Vehicle, 
  VehicleType, 
  Category, 
  Brand, 
  Vendor, 
  Feature, 
  VehicleImage 
} = require('../models/vehicle.model');
const { StatusCodes } = require('http-status-codes');
const MyPagination = require('../libs/MyPagination');
const fileUploadHelper = require('../utils/fileUpload');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize'); // Add this line

// Define the fields that can be searched and sorted
const vehicleFields = [
  'id', 'name', 'number_plate', 'model_year', 'color', 'fuel_type',
  'transmission_type', 'status', 'city', 'state', 'average_rating',
  'created_at', 'updated_at'
];

class VehicleController {
  // List all vehicles with pagination, search, and sort
  static async index(req, res) {
    try {
      const { page, limit, searchParams, sortBy } = req.query;
      
      // Initialize search parameters
      let finalSearchParams = searchParams || '';

      
      // If user is a vendor, add vendor_user_id filter
      if (req.user && req.user.role === 'vendor') {
        
        
        const vendorFilter = `vendor_user_id=:${req.user.id}`;
        finalSearchParams = finalSearchParams 
          ? `${vendorFilter},${finalSearchParams}`
          : vendorFilter;
      }

      // Initialize pagination with final search parameters
      const pagination = new MyPagination(
        Vehicle, 
        page, 
        limit, 
        finalSearchParams, 
        sortBy, 
        vehicleFields
      );

      const result = await pagination.paginate();
      
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error("Error listing vehicles:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving vehicles'
      });
    }
  }

  // Get a single vehicle by ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByPk(id, {
        include: [
          { model: VehicleType, as: 'vehicle_type', attributes: ['id', 'name'] },
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: Brand, attributes: ['id', 'name', 'logo_url'] },
          { model: Vendor, as: 'vendor', attributes: ['id', 'company_name', 'contact_person', 'phone'] },
          { model: VehicleImage, attributes: ['id', 'image_url', 'is_primary'] }
        ]
      });

      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Add availability status
      const isAvailable = await vehicle.isAvailable();
      const needsMaintenance = await vehicle.needsMaintenance();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: {
          ...vehicle.toJSON(),
          is_available: isAvailable,
          needs_maintenance: needsMaintenance
        }
      });
    } catch (error) {
      console.error("Error retrieving vehicle:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving vehicle'
      });
    }
  }

  // Create a new vehicle
  static async store(req, res) {
    const vehicleImages = [];
    let mainImageUrl = null;
    
    try {
      // Validate references
      const [vehicleType, category, brand, vendor] = await Promise.all([
        VehicleType.findByPk(req.body.vehicle_type_id),
        Category.findByPk(req.body.category_id),
        Brand.findByPk(req.body.brand_id),
        Vendor.findByPk(req.body.vendor_id)
      ]);

      if (!vehicleType || !category || !brand || !vendor) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid vehicle type, category, brand, or vendor'
        });
      }

      // Check if number plate already exists
      const existingVehicle = await Vehicle.findOne({
        where: { number_plate: req.body.number_plate }
      });

      if (existingVehicle) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Vehicle with number plate ${req.body.number_plate} already exists`,
          field: 'number_plate'
        });
      }

      // Handle image uploads
      if (req.files) {
        if (req.files.main_image) {
          const mainImageResult = await fileUploadHelper.uploadSingle(req.files.main_image, {
            subDirectory: 'vehicles',
            prefix: 'main'
          });
          mainImageUrl = mainImageResult.path;
        }

        if (req.files.images) {
          const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
          for (const image of images) {
            const imageResult = await fileUploadHelper.uploadSingle(image, {
              subDirectory: 'vehicles',
              prefix: 'additional'
            });
            vehicleImages.push(imageResult.path);
          }
        }
      }

      // Create vehicle with images
      const result = await Vehicle.create({
        ...req.body,
        images: vehicleImages,
        main_image: mainImageUrl,
        vendor_user_id: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Create vehicle images
      if (vehicleImages.length > 0) {
        await VehicleImage.bulkCreate(
          vehicleImages.map(img => ({
            vehicle_id: result.id,
            image_url: img,
            is_primary: false
          }))
        );
      }

      // Fetch the created vehicle with associations
      const vehicle = await Vehicle.findByPk(result.id, {
        include: [
          { model: VehicleType, as: 'vehicle_type', attributes: ['id', 'name'] },
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: Brand, attributes: ['id', 'name'] },
          { model: Vendor, as: 'vendor', attributes: ['id', 'company_name'] },
          { model: VehicleImage, attributes: ['id', 'image_url', 'is_primary'] }
        ]
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      
      // Handle specific database errors
      if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') {
        const field = error.fields ? Object.keys(error.fields)[0] : null;
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `This ${field || 'value'} is already in use`,
          field: field
        });
      }

      // Clean up uploaded files if there was an error
      for (const image of vehicleImages) {
        await fileUploadHelper.deleteFile(image);
      }
      if (mainImageUrl) {
        await fileUploadHelper.deleteFile(mainImageUrl);
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create vehicle',
        error: error.message
      });
    }
  }

  // Update a vehicle
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing vehicle
      const vehicle = await Vehicle.findByPk(id, {
        include: [{ model: VehicleImage }]
      });

      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Handle main image update if provided
      let mainImageUrl = vehicle.main_image;
      if (req.files?.main_image) {
        // Delete existing main image
        if (vehicle.main_image) {
          await fileUploadHelper.deleteFile(vehicle.main_image);
        }
        
        // Upload new main image
        const mainImageResult = await fileUploadHelper.uploadSingle(req.files.main_image, {
          subDirectory: 'vehicles',
          prefix: 'main'
        });
        mainImageUrl = mainImageResult.path;
      }

      // Handle additional images
      if (req.files?.images) {
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const existingImageIds = req.body.existing_image_ids ? JSON.parse(req.body.existing_image_ids) : [];
        
        // Delete images that are not in existingImageIds
        for (const image of vehicle.VehicleImages) {
          if (!existingImageIds.includes(image.id)) {
            await fileUploadHelper.deleteFile(image.image_url);
            await image.destroy();
          }
        }
        
        // Upload new images
        const newImages = [];
        for (const image of images) {
          try {
            const uploadResult = await fileUploadHelper.uploadSingle(image, {
              subDirectory: 'vehicles',
              prefix: 'additional'
            });
            
            newImages.push({
              vehicle_id: id,
              image_url: uploadResult.path,
              is_primary: false
            });
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
          }
        }

        // Create new image records
        if (newImages.length > 0) {
          await VehicleImage.bulkCreate(newImages);
        }
      }

      // Parse features if provided
      let features = vehicle.features;
      if (req.body.features) {
        try {
          features = JSON.parse(req.body.features);
        } catch (error) {
          console.error("Error parsing features:", error);
        }
      }

      // Update the vehicle
      await vehicle.update({
        ...req.body,
        main_image: mainImageUrl,
        features: features
      });

      // Fetch updated vehicle with associations
      const updatedVehicle = await Vehicle.findByPk(id, {
        include: [
          { model: VehicleType, as: 'vehicle_type', attributes: ['id', 'name'] },
          { model: Category, as: 'category', attributes: ['id', 'name'] },
          { model: Brand, attributes: ['id', 'name'] },
          { model: Vendor, as: 'vendor', attributes: ['id', 'company_name'] },
          { model: VehicleImage, attributes: ['id', 'image_url', 'is_primary'] }
        ]
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: updatedVehicle
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error updating vehicle'
      });
    }
  }

  // Delete a vehicle
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      
      // Find existing vehicle with images
      const vehicle = await Vehicle.findByPk(id, {
        include: [{ model: VehicleImage }]
      });

      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Delete with transaction
      await sequelize.transaction(async (t) => {
        // Delete associated images
        for (const image of vehicle.VehicleImages) {
          await fileUploadHelper.deleteFile(image.image_url);
          await image.destroy({ transaction: t });
        }

        // Update vendor's total_vehicles count
        await Vendor.decrement('total_vehicles', {
          by: 1,
          where: { id: vehicle.vendor_id },
          transaction: t
        });

        // Delete the vehicle
        await vehicle.destroy({ transaction: t });
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error deleting vehicle'
      });
    }
  }

  // Calculate rental price
  static async calculateRentalPrice(req, res) {
    try {
      const { id } = req.params;
      const { days } = req.query;

      if (!days || isNaN(days) || days < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Valid number of days is required'
        });
      }

      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      const rentalPrice = vehicle.calculateRentalPrice(parseInt(days));

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          rental_price: rentalPrice,
          days: parseInt(days),
          security_deposit: vehicle.security_deposit,
          total_amount: rentalPrice + vehicle.security_deposit
        }
      });
    } catch (error) {
      console.error("Error calculating rental price:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error calculating rental price'
      });
    }
  }

  // List all vehicles with custom pagination and filtering
  static async vehicleList(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
      const search = req.query.search || '';
      const sort = req.query.sort || 'created_at';
      const order = req.query.order || 'DESC';

      // Build where clause
      let whereClause = {};
      
      // Add search condition
      if (search) {
        whereClause = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { number_plate: { [Op.iLike]: `%${search}%` } },
            { color: { [Op.iLike]: `%${search}%` } },
            { city: { [Op.iLike]: `%${search}%` } },
            { state: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }

      // Add filters
      if (filter.vehicle_type_id) whereClause.vehicle_type_id = filter.vehicle_type_id;
      if (filter.category_id) whereClause.category_id = filter.category_id;
      if (filter.brand_id) whereClause.brand_id = filter.brand_id;
      if (filter.vendor_id) whereClause.vendor_id = filter.vendor_id;
      if (filter.status) whereClause.status = filter.status;
      if (filter.city) whereClause.city = { [Op.iLike]: `%${filter.city}%` };
      if (filter.state) whereClause.state = { [Op.iLike]: `%${filter.state}%` };
      if (filter.fuel_type) whereClause.fuel_type = filter.fuel_type;
      if (filter.transmission_type) whereClause.transmission_type = filter.transmission_type;
      if (filter.price_range) {
        whereClause.daily_rate = {
          [Op.between]: [filter.price_range.min || 0, filter.price_range.max || 999999]
        };
      }
      if (filter.seating_capacity) {
        whereClause.seating_capacity = {
          [Op.between]: [filter.seating_capacity.min || 1, filter.seating_capacity.max || 50]
        };
      }

      // Get total count for pagination
      const totalItems = await Vehicle.count({ where: whereClause });
      const totalPages = Math.ceil(totalItems / limit);

      // Get vehicles with associations
      const vehicles = await Vehicle.findAll({
        where: whereClause,
        include: [
          {
            model: VehicleType,
            as: 'vehicle_type',
            attributes: ['id', 'name', 'icon'],
            required: true
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'description'],
            required: true
          },
          {
            model: Brand,
            attributes: ['id', 'name', 'logo_url'],
            required: true
          },
          {
            model: Vendor,
            as: 'vendor',
            attributes: ['id', 'company_name', 'contact_person', 'phone', 'city', 'state'],
            required: true
          },
          {
            model: VehicleImage,
            attributes: ['id', 'image_url', 'is_primary'],
            required: false
          },
          {
            model: Feature,
            attributes: ['id', 'name', 'icon'],
            required: false,
            through: { attributes: [] } // Exclude junction table attributes
          }
        ],
        order: [[sort, order]],
        limit: limit,
        offset: offset,
        distinct: true // Important for correct count with associations
      });

      // Transform data to include primary image and format features
      const formattedVehicles = vehicles.map(vehicle => {
        const vehicleJson = vehicle.toJSON();
        return {
          ...vehicleJson,
          primary_image: vehicleJson.VehicleImages?.find(img => img.is_primary)?.image_url || null,
          additional_images: vehicleJson.VehicleImages?.filter(img => !img.is_primary).map(img => img.image_url) || [],
          features: vehicleJson.Features?.map(feature => ({
            id: feature.id,
            name: feature.name,
            icon: feature.icon
          })) || [],
          // Remove redundant data
          VehicleImages: undefined,
          Features: undefined
        };
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: {
          vehicles: formattedVehicles,
          pagination: {
            total_items: totalItems,
            total_pages: totalPages,
            current_page: page,
            items_per_page: limit,
            has_next_page: page < totalPages,
            has_previous_page: page > 1
          },
          filters: {
            search,
            sort,
            order,
            ...filter
          }
        }
      });

    } catch (error) {
      console.error("Error listing vehicles:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error retrieving vehicles'
      });
    }
  }

}

module.exports = VehicleController;
