// Single File Upload
const result = await fileUploadHelper.uploadSingle(req.files.image, {
    subDirectory: 'products',
    prefix: 'product',
    fileType: 'image' // Uses image config
  });
  
  // Multiple Files Upload
  const results2 = await fileUploadHelper.uploadMultiple(req.files.images, {
    subDirectory: 'products',
    prefix: 'product',
    fileType: 'image',
    minFiles: 2, // Require at least 2 files
    maxFiles: 5  // Allow up to 5 files
  });
  
  // Update Multiple Files
  const results3 = await fileUploadHelper.updateMultiple(
    req.files.newImages,
    oldFilePaths,
    {
      subDirectory: 'products',
      prefix: 'product'
    }
  );
  
  // Delete Multiple Files
  const results4 = await fileUploadHelper.deleteMultiple(filePaths);

  // Get the base upload directory path
  // Example: Product controller with multiple images
// async store(req, res) {
//     try {
//       // Upload multiple product images
//       const imageResults = await fileUploadHelper.uploadMultiple(req.files.images, {
//         subDirectory: 'products',
//         prefix: 'product',
//         fileType: 'image',
//         minFiles: 1,
//         maxFiles: 5
//       });
  
//       // Create product with image paths
//       const product = await Product.create({
//         ...req.body,
//         images: imageResults.map(result => result.path)
//       });
  
//       res.status(StatusCodes.CREATED).json({
//         success: true,
//         data: product
//       });
//     } catch (error) {
//       // Handle error
//     }
//   }
  
//   // Example: Update with multiple files
//   async update(req, res) {
//     try {
//       const product = await Product.findByPk(req.params.id);
      
//       // Update images if provided
//       if (req.files?.images) {
//         const imageResults = await fileUploadHelper.updateMultiple(
//           req.files.images,
//           product.images,
//           {
//             subDirectory: 'products',
//             prefix: 'product'
//           }
//         );
        
//         product.images = imageResults.map(result => result.path);
//       }
  
//       await product.save();
//       res.json({ success: true, data: product });
//     } catch (error) {
//       // Handle error
//     }
//   }

const { Model, DataTypes } = require('sequelize');
const fileUploadHelper = require('./fileUpload');
const { StatusCodes } = require('http-status-codes');

/**
 * Example Product Model showing both array and string storage methods
 */
class Product extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // Method 1: Store as JSON array
      imagesArray: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
          const images = this.getDataValue('imagesArray');
          return images || [];
        },
        set(value) {
          this.setDataValue('imagesArray', value || []);
        }
      },
      // Method 2: Store as comma-separated string
      imagesString: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const images = this.getDataValue('imagesString');
          return images ? images.split(',') : [];
        },
        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue('imagesString', value.join(','));
          } else {
            this.setDataValue('imagesString', value || '');
          }
        }
      }
    }, {
      sequelize,
      modelName: 'Product'
    });
  }
}

/**
 * Example Controller showing both storage methods
 */
class ProductController {
  /**
   * Store product with multiple images using Array storage
   */
  static async storeWithArray(req, res) {
    try {
      // Validate request
      if (!req.files?.images) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide product images'
        });
      }

      // Upload multiple images
      const imageResults = await fileUploadHelper.uploadMultiple(req.files.images, {
        subDirectory: 'products',
        prefix: 'product',
        fileType: 'image',
        minFiles: 1,
        maxFiles: 5
      });

      // Create product with images stored as JSON array
      const product = await Product.create({
        name: req.body.name,
        imagesArray: imageResults.map(result => result.path)
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating product'
      });
    }
  }

  /**
   * Store product with multiple images using String storage
   */
  static async storeWithString(req, res) {
    try {
      // Validate request
      if (!req.files?.images) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide product images'
        });
      }

      // Upload multiple images
      const imageResults = await fileUploadHelper.uploadMultiple(req.files.images, {
        subDirectory: 'products',
        prefix: 'product',
        fileType: 'image',
        minFiles: 1,
        maxFiles: 5
      });

      // Create product with images stored as comma-separated string
      const product = await Product.create({
        name: req.body.name,
        imagesString: imageResults.map(result => result.path)
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Product created successfully',
        data: {
          ...product.toJSON(),
          images: product.imagesString // This will return an array due to getter
        }
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating product'
      });
    }
  }

  /**
   * Update product with multiple images using Array storage
   */
  static async updateWithArray(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Handle image updates if new images are provided
      if (req.files?.images) {
        // Update images and delete old ones
        const imageResults = await fileUploadHelper.updateMultiple(
          req.files.images,
          product.imagesArray, // Current images will be deleted
          {
            subDirectory: 'products',
            prefix: 'product',
            fileType: 'image'
          }
        );

        // Update product with new image paths
        product.imagesArray = imageResults.map(result => result.path);
      }

      // Update other fields
      if (req.body.name) {
        product.name = req.body.name;
      }

      await product.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error updating product'
      });
    }
  }

  /**
   * Delete product and its images
   */
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete all associated images
      // Works for both storage methods since both getters return arrays
      await fileUploadHelper.deleteMultiple(product.imagesArray);
      // OR for string storage: await fileUploadHelper.deleteMultiple(product.imagesString);

      // Delete the product
      await product.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error deleting product'
      });
    }
  }

  /**
   * Example usage in routes
   */
  static setupRoutes(router) {
    router.post('/products/array', ProductController.storeWithArray);
    router.post('/products/string', ProductController.storeWithString);
    router.put('/products/array/:id', ProductController.updateWithArray);
    router.delete('/products/:id', ProductController.destroy);
  }
}

module.exports = {
  Product,
  ProductController
};