const express = require('express');
const VehicleTypeController = require('../../controllers/VehicleType.controller');
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
});

// Middleware to handle file validation
const validateFileUpload = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (req.files.icon) {
    try {
      fileUploadHelper.validateSingleFile(req.files.icon, fileUploadHelper.config.image);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  next();
};

// Public routes
router.get('', VehicleTypeController.list);  // List all vehicle types
router.get('/:id', VehicleTypeController.show);  // Get a vehicle type by ID

// Protected routes (admin only)
router.post('', 
  authenticateToken, 
  authorizeRoles('admin'),
  upload, // Add file upload middleware first
  validateFileUpload, // Then validate the file
  VehicleTypeController.store
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'),
  upload,
  validateFileUpload,
  VehicleTypeController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  VehicleTypeController.destroy
);

module.exports = router;