const express = require('express');
const VehicleController = require('../../controllers/Vehicle.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');
const fileUpload = require('express-fileupload');
const fileUploadHelper = require('../../utils/fileUpload');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

// Configure file upload middleware
const upload = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10 // Maximum number of files
  }
});

// Middleware to handle file validation
const validateFileUpload = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  try {
    // Validate main image if present
    if (req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      // Check if number of files exceeds limit
      if (images.length > 10) {
        throw new Error('Maximum 10 images allowed');
      }

      // Validate each image
      images.forEach(image => {
        fileUploadHelper.validateSingleFile(image, {
          ...fileUploadHelper.config.image,
          maxSize: 5 * 1024 * 1024 // 5MB
        });
      });
    }

    next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

// Public routes
router.get('', authenticateToken, 
  authorizeRoles(['admin', 'vendor']),VehicleController.index);  // Basic list with pagination
router.get('/list', VehicleController.vehicleList);  // Advanced list with filters
router.get('/:id', VehicleController.show);  // Get vehicle details
router.get('/:id/rental-price', VehicleController.calculateRentalPrice);  // Calculate rental price

// Protected routes (vendor and admin)
router.post('', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']),
  upload,
  validateFileUpload,
  VehicleController.store
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']),
  upload,
  validateFileUpload,
  VehicleController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']), 
  VehicleController.destroy
);

// Middleware to check if vendor owns the vehicle
const checkVehicleOwnership = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Admin can access all vehicles
    if (req.user.role === 'admin') {
      return next();
    }

    // Vendor can only access their own vehicles
    if (req.user.role === 'vendor' && vehicle.vendor_id !== req.user.vendor_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to access this vehicle'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking vehicle ownership:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error checking vehicle ownership'
    });
  }
};

// Add ownership check to protected routes
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']),
  checkVehicleOwnership,
  upload,
  validateFileUpload,
  VehicleController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'vendor']), 
  checkVehicleOwnership,
  VehicleController.destroy
);

module.exports = router;
