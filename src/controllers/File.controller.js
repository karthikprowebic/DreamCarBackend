// controllers/FileController.js
const File = require('../models/File.model');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Op } = require('sequelize');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/files/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

class FileController {
  // Create and upload a new file
static async create(req, res) {
    const uploadMiddleware = upload.array('files'); // Expecting multiple files with the field name 'files'

    try {
        await new Promise((resolve, reject) => {
            uploadMiddleware(req, res, function (err) {
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
                resolve();
            });
        });

        if (!req.files || req.files.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = await Promise.all(
            req.files.map(async (file) => {
                const fileData = {
                    name: file.originalname,
                    url: path.join('files', file.filename),
                    size: file.size
                };

                // Save each file's data to the database
                return await File.create(fileData);
            })
        );

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Files uploaded successfully',
            data: uploadedFiles
        });

    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}


  // Delete a file
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Find the file by ID
      const file = await File.findByPk(id);
      if (!file) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'File not found'
        });
      }

      // Delete file from the filesystem
      const filePath = path.resolve('public/uploads', file.url);
      await fs.unlink(filePath).catch(err => {
        if (err.code !== 'ENOENT') console.error('Error deleting file:', err.message);
      });

      // Remove file record from the database
      await file.destroy();

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Server error'
      });
    }
  }

   // List all files with pagination
  static async fileList(req, res) {
  const page = parseInt(req.query.page , 10) || 1;
  const limit = parseInt(req.query.limit , 10) || 10;

  try {
    const offset = (page - 1) * limit;

    const { count, rows: files } = await File.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: files,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_items: count,
        per_page: limit
      }
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
}

  // Search files by name
// Search files by name
static async searchByName(req, res) {
  const { name } = req.params;

  try {
    const files = await File.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`  // Partial match search
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (files.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No files found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error("Error searching files:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
}


    // Update file name by primary key (ID)
  static async updateByPK(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      // Find the file by primary key (ID)
      const file = await File.findByPk(id);
      if (!file) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'File not found'
        });
      }

      // Update only the file name
      file.name = name;
      await file.save();

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'File name updated successfully',
        data: file
      });
    } catch (error) {
      console.error("Error updating file name:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  }

}

module.exports = FileController;
