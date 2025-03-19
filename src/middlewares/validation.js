const { StatusCodes } = require('http-status-codes');

// Middleware for validating with Zod
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Validate request body
    next(); // If validation passes, proceed to the next middleware/controller
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};

module.exports = validate;
