const path = require('path');
const fs = require('fs').promises;
const createError = require('http-errors');

class FileUploadHelper {
  constructor() {
    // Default configurations
    this.config = {
      image: {
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp','image/avif'],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 10
      },
      document: {
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5
      },
      video: {
        allowedTypes: ['video/mp4', 'video/mpeg', 'video/quicktime'],
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxFiles: 3
      }
    };
  }

  /**
   * Get the base upload directory path
   * @returns {string} Base upload directory path
   */
  getUploadDir() {
    return path.join(process.cwd(), 'public', 'uploads');
  }

  /**
   * Create a unique filename with the original extension
   * @param {string} originalName - Original filename
   * @param {string} prefix - Optional prefix for the filename
   * @returns {string} Unique filename
   */
  generateUniqueFileName(originalName, prefix = '') {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalName);
    return `${prefix}${prefix ? '-' : ''}${uniqueSuffix}${extension}`;
  }

  /**
   * Validate a single file
   * @param {Object} file - File object from express-fileupload
   * @param {Object} options - Validation options
   * @throws {Error} If validation fails
   */
  validateSingleFile(file, options = {}) {
    const {
      allowedTypes = this.config.image.allowedTypes,
      maxFileSize = this.config.image.maxFileSize
    } = options;

    if (!file) {
      throw createError(400, 'No file provided');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw createError(400, `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxFileSize) {
      throw createError(400, `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`);
    }
  }

  /**
   * Validate multiple files
   * @param {Array} files - Array of file objects
   * @param {Object} options - Validation options
   * @throws {Error} If validation fails
   */
  validateMultipleFiles(files, options = {}) {
    const {
      allowedTypes = this.config.image.allowedTypes,
      maxFileSize = this.config.image.maxFileSize,
      maxFiles = this.config.image.maxFiles,
      minFiles = 1
    } = options;

    if (!Array.isArray(files)) {
      throw createError(400, 'Files must be provided as an array');
    }

    if (files.length < minFiles) {
      throw createError(400, `At least ${minFiles} file(s) required`);
    }

    if (files.length > maxFiles) {
      throw createError(400, `Maximum ${maxFiles} files allowed`);
    }

    files.forEach((file, index) => {
      try {
        this.validateSingleFile(file, { allowedTypes, maxFileSize });
      } catch (error) {
        throw createError(400, `File ${index + 1}: ${error.message}`);
      }
    });
  }

  /**
   * Process a single file upload
   * @param {Object} file - File object to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async processSingleUpload(file, options = {}) {
    const {
      subDirectory = '',
      prefix = ''
    } = options;

    // Create upload directory
    const uploadDir = path.join(this.getUploadDir(), subDirectory);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = this.generateUniqueFileName(file.name, prefix);
    const uploadPath = path.join(uploadDir, filename);

    // Move the file
    await file.mv(uploadPath);

    // Return the relative path for database storage
    const relativePath = path.join('/uploads', subDirectory, filename).replace(/\\/g, '/');

    return {
      success: true,
      path: relativePath,
      filename,
      originalName: file.name,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  /**
   * Upload a single file
   * @param {Object} file - File object from express-fileupload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadSingle(file, options = {}) {
    try {
      const {
        subDirectory = '',
        prefix = '',
        fileType = 'image'
      } = options;

      // Get config based on file type
      const config = this.config[fileType] || this.config.image;
      
      // Validate the file
      this.validateSingleFile(file, {
        allowedTypes: options.allowedTypes || config.allowedTypes,
        maxFileSize: options.maxFileSize || config.maxFileSize
      });

      // Process the upload
      return await this.processSingleUpload(file, { subDirectory, prefix });
    } catch (error) {
      console.error('File upload error:', error);
      throw createError(error.status || 500, error.message || 'Error uploading file');
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of file objects
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultiple(files, options = {}) {
    try {
      const {
        subDirectory = '',
        prefix = '',
        fileType = 'image',
        minFiles = 1
      } = options;

      // Convert single file to array if needed
      const fileArray = Array.isArray(files) ? files : [files];

      // Get config based on file type
      const config = this.config[fileType] || this.config.image;

      // Validate all files first
      this.validateMultipleFiles(fileArray, {
        allowedTypes: options.allowedTypes || config.allowedTypes,
        maxFileSize: options.maxFileSize || config.maxFileSize,
        maxFiles: options.maxFiles || config.maxFiles,
        minFiles
      });

      // Process all uploads
      const uploadPromises = fileArray.map(file => 
        this.processSingleUpload(file, { subDirectory, prefix })
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple files upload error:', error);
      throw createError(error.status || 500, error.message || 'Error uploading files');
    }
  }

  /**
   * Delete multiple files
   * @param {Array} filePaths - Array of file paths to delete
   * @returns {Promise<Array>} Array of deletion results
   */
  async deleteMultiple(filePaths) {
    if (!Array.isArray(filePaths)) {
      filePaths = [filePaths];
    }

    const results = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          const success = await this.deleteFile(filePath);
          return { filePath, success };
        } catch (error) {
          return { filePath, success: false, error: error.message };
        }
      })
    );

    return results;
  }

  /**
   * Delete a single file
   * @param {string} filePath - Path of the file to delete
   * @returns {Promise<boolean>} True if file was deleted
   */
  async deleteFile(filePath) {
    try {
      if (!filePath) return true;

      // Convert relative path to absolute path
      const absolutePath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));

      // Check if file exists
      await fs.access(absolutePath);

      // Delete the file
      await fs.unlink(absolutePath);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Update a single file
   * @param {Object} newFile - New file to upload
   * @param {string} oldFilePath - Path of the old file to delete
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async updateFile(newFile, oldFilePath, options = {}) {
    // Delete old file if it exists
    await this.deleteFile(oldFilePath);

    // Upload new file
    return await this.uploadSingle(newFile, options);
  }

  /**
   * Update multiple files
   * @param {Array} newFiles - Array of new files to upload
   * @param {Array} oldFilePaths - Array of old file paths to delete
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async updateMultiple(newFiles, oldFilePaths = [], options = {}) {
    // Delete old files
    await this.deleteMultiple(oldFilePaths);

    // Upload new files
    return await this.uploadMultiple(newFiles, options);
  }
}

// Create a singleton instance
const fileUploadHelper = new FileUploadHelper();

module.exports = fileUploadHelper;
