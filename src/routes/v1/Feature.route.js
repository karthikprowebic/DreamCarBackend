const express = require('express');
const FeatureController = require('../../controllers/Feature.controller');
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
router.get('', FeatureController.index);  // List all features
router.get('/:id', FeatureController.show);  // Get a feature by ID

// Protected routes (admin only)
router.post('', 
  authenticateToken, 
  authorizeRoles('admin'),
  upload, // Add file upload middleware first
  validateFileUpload, // Then validate the file
  FeatureController.store
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'),
  upload,
  validateFileUpload,
  FeatureController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  FeatureController.destroy
);

module.exports = router;
