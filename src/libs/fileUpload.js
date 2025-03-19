// utils/fileUpload.js
const multer = require('multer');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

class FileUpload {
  static getStorage(destination) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }

  static getFileFilter() {
    return (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Not an image! Please upload only images.'), false);
      }
    };
  }

  static getMulter(destination) {
    return multer({
      storage: this.getStorage(destination),
      fileFilter: this.getFileFilter(),
      limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
      }
    });
  }

  // Static method to handle single file upload
  static async uploadSingle(destination, fieldName, req, res) {
    const uploader = this.getMulter(destination);

    return new Promise((resolve, reject) => {
      uploader.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          reject({
            status: StatusCodes.BAD_REQUEST,
            message: 'File upload error',
            error: err.message
          });
        } else if (err) {
          reject({
            status: StatusCodes.BAD_REQUEST,
            message: 'Error',
            error: err.message
          });
        }

        if (!req.file) {
          resolve(null);
          return;
        }

        resolve({
          filename: req.file.filename,
          path: path.join(path.basename(destination), req.file.filename)
        });
      });
    });
  }

  // Static method to handle multiple file upload
  static async uploadMultiple(destination, fieldName, req, res, maxCount = 5) {
    const uploader = this.getMulter(destination);

    return new Promise((resolve, reject) => {
      uploader.array(fieldName, maxCount)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          reject({
            status: StatusCodes.BAD_REQUEST,
            message: 'File upload error',
            error: err.message
          });
        } else if (err) {
          reject({
            status: StatusCodes.BAD_REQUEST,
            message: 'Error',
            error: err.message
          });
        }

        if (!req.files || req.files.length === 0) {
          resolve([]);
          return;
        }

        const uploadedFiles = req.files.map(file => ({
          filename: file.filename,
          path: path.join(path.basename(destination), file.filename)
        }));

        resolve(uploadedFiles);
      });
    });
  }
}

// Define common upload destinations
const UPLOAD_PATHS = {
  PRODUCTS: 'public/uploads/products',
  USERS: 'public/uploads/users',
  BASE: 'public/uploads',
  // Add more paths as needed
};

module.exports = {
  FileUpload,
  UPLOAD_PATHS
};