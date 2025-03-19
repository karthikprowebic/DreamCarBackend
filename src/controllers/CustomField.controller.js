const CustomModel = require('../models/MyField.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { StatusCodes } = require('http-status-codes');
const { addressFields, customFields } = require('../libs/fieldsName');
const MyPagination = require('../libs/MyPagination');

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/custom/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

class CustomModelController {
  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    // const pagination = new Pagination(CustomModel, page, limit, searchParams, sortBy, customFields);
    const pagination = new MyPagination (CustomModel, page, limit, searchParams, sortBy, customFields);
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Create new custom model
  static async store(req, res) {
    const uploadMiddleware = upload.any();

    try {
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            reject({ status: StatusCodes.BAD_REQUEST, message: 'File upload error', error: err.message });
          } else if (err) {
            reject({ status: StatusCodes.BAD_REQUEST, message: 'Error', error: err.message });
          }
          resolve();
        });
      });

      const { name, customFields } = req.body;

      // Check for unique name
      // const existingModel = await CustomModel.findOne({ where: { name } });
      // if (existingModel) {
      //   return res.status(StatusCodes.CONFLICT).json({
      //     success: false,
      //     message: 'A model with this name already exists'
      //   });
      // }

      const parsedFields = JSON.parse(customFields);

      // Map images to the appropriate fields
      let imageIndex = 0;
      const updatedFields = parsedFields.map(field => {
        if (field.type === 'image' && req.files[imageIndex]) {
          const imagePath = path.join('custom', path.basename(req.files[imageIndex].path));
          imageIndex += 1;
          return { ...field, imagePath };
        } else {
          return field;
        }
      });

      const customModel = await CustomModel.create({
        name,
        customFields: JSON.stringify(updatedFields)
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Custom model created successfully',
        data: customModel
      });

    } catch (error) {
      console.error("Error creating custom model:", error);
      const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  }

  static async deleteStore(req, res) {
  const { id } = req.params;
  const uploadMiddleware = upload.any();

  try {
    // Find and delete the existing custom model
    const customModel = await CustomModel.findByPk(id);
    if (!customModel) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Custom model not found'
      });
    }

    await customModel.destroy();

    // Handle file uploads
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          reject({ status: StatusCodes.BAD_REQUEST, message: 'File upload error', error: err.message });
        } else if (err) {
          reject({ status: StatusCodes.BAD_REQUEST, message: 'Error', error: err.message });
        }
        resolve();
      });
    });

    const { name, customFields } = req.body;
    const parsedFields = JSON.parse(customFields);

    // Map images to the appropriate fields
    let imageIndex = 0;
    const updatedFields = parsedFields.map(field => {
      if (field.type === 'image' && req.files[imageIndex]) {
        const imagePath = path.join('custom', path.basename(req.files[imageIndex].path));
        imageIndex += 1;
        return { ...field, imagePath };
      } else {
        return field;
      }
    });

    // Create new custom model entry
    const newCustomModel = await CustomModel.create({
      name,
      customFields: JSON.stringify(updatedFields)
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Custom model created successfully',
      data: newCustomModel
    });

  } catch (error) {
    console.error("Error creating custom model:", error);
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
}


  // Update custom model
  static async update(req, res) {
    const uploadMiddleware = upload.any();

    try {
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            reject({ status: StatusCodes.BAD_REQUEST, message: 'File upload error', error: err.message });
          } else if (err) {
            reject({ status: StatusCodes.BAD_REQUEST, message: 'Error', error: err.message });
          }
          resolve();
        });
      });

      const { id } = req.params;
      const { name, customFields } = req.body;
      const parsedFields = JSON.parse(customFields);

      const customModel = await CustomModel.findByPk(id);
      if (!customModel) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Custom model not found'
        });
      }

      let imageIndex = 0;
      const updatedFields = parsedFields.map(field => {
        if (field.type === 'image' && req.files[imageIndex]) {
          const imagePath = path.join('custom', path.basename(req.files[imageIndex].path));
          imageIndex += 1;

          if (field.imagePath) {
            fs.unlink(path.resolve(field.imagePath)).catch(console.error);
          }
          return { ...field, imagePath };
        } else {
          return field;
        }
      });

      await customModel.update({
        name,
        customFields: JSON.stringify(updatedFields)
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Custom model updated successfully',
        data: customModel
      });

    } catch (error) {
      console.error("Error updating custom model:", error);
      const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  }

  // Show custom model by primary key ID
static async show(req, res) {
  const { id } = req.params;
  try {
    const customModel = await CustomModel.findByPk(id);
    if (!customModel) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Custom model not found'
      });
    }

    // Parse the customFields JSON string back to an object or array
    const parsedCustomFields = JSON.parse(customModel.customFields);
    // const parsedCustomFields = JSON.parse(customModel.customFields);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...customModel.toJSON(),
        customFields: JSON.parse(parsedCustomFields) // Use the parsed customFields value
      }
    });
  } catch (error) {
    console.error("Error retrieving custom model:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
}

static async showMyName(req, res) {
  const { name } = req.params;
  try {
    const customModels = await CustomModel.findAll({ where: { name } });

    if (!customModels || customModels.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Custom models not found'
      });
    }

    // Parse customFields for each model
    const parsedModels = customModels.map(model => {
      const parsedCustomFields = JSON.parse(model.customFields);
      return {
        ...model.toJSON(),
        customFields: JSON.parse(parsedCustomFields)
      };
    });

    // Transform the response data
    let transformedData;
    
    // Check if there's only a single item
    if (parsedModels.length === 1) {
      const singleItem = parsedModels[0];
      const mappedFields = {};

      // Map the customFields directly into a single object
      singleItem.customFields.forEach((field) => {
        mappedFields[field.key] = field.type === "image" ? field.imagePath : field.value;
      });

      transformedData = mappedFields; // Single object
    } else {
      // Handle multiple items
      transformedData = parsedModels.map((item) => {
        const mappedFields = {};
        item.customFields.forEach((field) => {
          mappedFields[field.key] = field.type === "image" ? field.imagePath : field.value;
        });
        return mappedFields;
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error("Error retrieving models by name:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Delete custom model
static async delete(req, res) {
  const { id } = req.params;

  try {
    const customModel = await CustomModel.findByPk(id);
    if (!customModel) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Custom model not found'
      });
    }

    // Delete the custom model from the database
    await customModel.destroy();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Custom model deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting custom model:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error'
    });
  }
}



}

module.exports = CustomModelController;
