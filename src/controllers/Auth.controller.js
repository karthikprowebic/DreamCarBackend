const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { StatusCodes } = require('http-status-codes');
const moment = require("moment");
const Pagination = require("../libs/Pagination");
const { userFields } = require("../libs/fieldsName");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const MyPagination = require("../libs/MyPagination");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const LOGIN_ATTEMPTS_LIMIT = parseInt(process.env.LOGIN_ATTEMPTS) || 5;
const LOGIN_BLOCK_TIME = 10; // 10 minutes block after reaching max login attempts

// Set up multer for file uploads (avatars)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = "public/uploads/avatars";
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
}).single("avatar");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        active: true,
        login_attempts: 0,
      });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async mobileRegister(req, res) {
    try {
      const { full_name, email, mobile, first_name, last_name, gender } =
        req.body;

      // Check if the user already exists based on email
      const existingEmailUser = await User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Check if the user already exists based on mobile
      const existingMobileUser = await User.findOne({ where: { mobile } });
      if (existingMobileUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User with this mobile number already exists",
        });
      }

      // Default password is '12345', hash it for security
      const defaultPassword = "12345";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      // Generate a 4-digit OTP for mobile verification
      const mobileOtp = Math.floor(1000 + Math.random() * 9000).toString();

      // Create the user with the provided details
      await User.create({
        full_name,
        email,
        mobile,
        first_name,
        last_name,
        gender,
        password: hashedPassword, // Save hashed default password
        mobile_otp: mobileOtp, // Save generated OTP
      });

      // Respond with success message
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async list(req, res) {
    const { page, limit, searchParams, sortBy } = req.query;
    const pagination = new MyPagination(
      User,
      page,
      limit,
      searchParams,
      sortBy,
      userFields
    );
    const result = await pagination.paginate();
    return res.status(StatusCodes.OK).json(result);
  }

  // Get a specific user by ID
  static async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
          });
        }

        const { name, email, role, active } = req.body;
        let avatar = user.avatar; // default to current avatar

        // If a new avatar is uploaded, process it
        if (req.file) {
          // Build the path for the new avatar
          avatar = `avatars/${req.file.filename}`;

          // Remove the old avatar if it exists
          if (user.avatar && user.avatar !== avatar) {
            const oldAvatarPath = path.join(
              __dirname,
              "..",
              "public",
              "uploads",
              "avatars",
              user.avatar
            );
            if (fs.existsSync(oldAvatarPath)) {
              fs.unlinkSync(oldAvatarPath);
            }
          }
        }

        // Update user information in the database
        await user.update({ name, email, role, active, avatar });

        return res.status(StatusCodes.OK).json({
          success: true,
          message: "User updated successfully",
          data: user,
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message,
        });
      }
    });
  }
  static async userUpdate(req, res) {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
          });
        }

        const { name } = req.body;
        let avatar = user.avatar; // default to current avatar

        // If a new avatar is uploaded, process it
        if (req.file) {
          // Build the path for the new avatar
          avatar = `avatars/${req.file.filename}`;

          // Remove the old avatar if it exists
          if (user.avatar && user.avatar !== avatar) {
            const oldAvatarPath = path.join(
              __dirname,
              "..",
              "public",
              "uploads",
              "avatars",
              user.avatar
            );
            if (fs.existsSync(oldAvatarPath)) {
              fs.unlinkSync(oldAvatarPath);
            }
          }
        }

        // Update user information in the database
        await user.update({ name, avatar });

        return res.status(StatusCodes.OK).json({
          success: true,
          message: "User updated successfully",
          data: user,
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message,
        });
      }
    });
  }

  static async updateUserNew(req, res) {
  try {
    const { id } = req.params; // Get user ID from route parameter
    const { full_name, email, mobile, first_name, last_name, gender, role, active } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the new email is already in use by another user
    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id }, // Exclude the current user
        },
      });

      if (existingEmailUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Email is already in use by another user',
        });
      }
    }

    // Check if the new mobile is already in use by another user
    if (mobile && mobile !== user.mobile) {
      const existingMobileUser = await User.findOne({
        where: {
          mobile,
          id: { [Op.ne]: id }, // Exclude the current user
        },
      });

      if (existingMobileUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Mobile number is already in use by another user',
        });
      }
    }

    // Update user details
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.gender = gender || user.gender;
    user.role = role || user.role;
    user.active = active !== undefined ? active : user.active;

    // Save updated user
    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
}

  static async updateProfile(req, res) {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
          });
        }

        const { name } = req.body;
        let avatar = user.avatar; // default to current avatar

        // If a new avatar is uploaded, process it
        if (req.file) {
          // Build the path for the new avatar
          avatar = `avatars/${req.file.filename}`;

          // Remove the old avatar if it exists
          if (user.avatar && user.avatar !== avatar) {
            const oldAvatarPath = path.join(
              __dirname,
              "..",
              "public",
              "uploads",
              "avatars",
              user.avatar
            );
            if (fs.existsSync(oldAvatarPath)) {
              fs.unlinkSync(oldAvatarPath);
            }
          }
        }

        // Update user information in the database
        await user.update({ name, avatar });

        return res.status(StatusCodes.OK).json({
          success: true,
          message: "User updated successfully",
          data: user,
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message,
        });
      }
    });
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid email and password",
        });
      }

      if (!user.active) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Account is inactive, please contact support",
        });
      }

      const now = moment();
      const lastAttemptTime = moment(user.login_attempts_date);

      if (
        user.login_attempts >= LOGIN_ATTEMPTS_LIMIT &&
        now.diff(lastAttemptTime, "minutes") < LOGIN_BLOCK_TIME
      ) {
        const timeLeft =
          LOGIN_BLOCK_TIME - now.diff(lastAttemptTime, "minutes");
        return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
          success: false,
          message: `Too many login attempts. Try again in ${timeLeft} minutes`,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        await user.update({
          login_attempts: user.login_attempts + 1,
          login_attempts_date: new Date(),
        });
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      await user.update({
        login_attempts: 0,
        login_attempts_date: null,
      });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

      res.json({
        success: true,
        message: "Login successful",
        is_auth: true,
        token,
        user: {
          id: user.id,
          name: user.full_name,
          first_name: user.first_name,
          last_name: user.last_name,
          mobile: user.mobile,
          gender: user.gender,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async checkMobileAndGenerateOtp(req, res) {
    try {
      const { mobile } = req.body;

      if (!mobile) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Mobile number is required",
        });
      }

      // Check if the mobile number exists in the database
      const user = await User.findOne({ where: { mobile } });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Mobile number is not registered",
        });
      }

      // Generate a new 4-digit OTP
      const mobileOtp = Math.floor(1000 + Math.random() * 9000).toString();

      // Update the OTP for the user
      await user.update({ mobile_otp: mobileOtp });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "OTP has been generated successfully",
        mobileOtp, // Include OTP in the response for testing
      });
    } catch (error) {
      console.error("Error in checkMobileAndGenerateOtp:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async mobileLogin(req, res) {
    try {
      const { mobile, mobile_otp } = req.body;

      // Check if the user exists with the provided mobile number
      const user = await User.findOne({ where: { mobile } });
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid mobile number or OTP",
        });
      }

      // Check if the user account is active
      if (!user.active) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Account is inactive, please contact support",
        });
      }

      // Validate the OTP
      if (user.mobile_otp !== mobile_otp) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      // Reset OTP after successful login
      await user.update({
        mobile_otp: null, // Clear the OTP after successful login
      });

      // Generate a JWT token for the user
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

      res.json({
        success: true,
        message: "Login successful",
        is_auth: true,
        token,
        user: {
          id: user.id,
          name: user.full_name,
          first_name: user.first_name,
          last_name: user.last_name,
          mobile: user.mobile,
          gender: user.gender,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error during mobile login:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { userId } = req.params; // Assuming userId is passed in the URL
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await user.update({
        password: hashedPassword,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async changeUserPassword(req, res) {
    try {
      const { id } = req.params; // Assuming id is passed in the URL
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await user.update({
        password: hashedPassword,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Fetch the authenticated user's data
  static async user(req, res) {
    try {
      const userId = req.user.id; // Extract user ID from JWT token decoded in middleware

      // Fetch the user details from the database
      const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "role", "avatar", "active"], // Specify which fields to return
      });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User retrieved successfully",
        data: user, // Return user details
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to retrieve user data. Please try again later.",
      });
    }
  }

  static async createNewUser(req, res) {
  try {
    const { full_name, email, password, mobile, first_name, last_name, gender, role } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !mobile) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing required fields: full_name, email, password, mobile',
      });
    }

    // Check if the email already exists
    const existingEmailUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingEmailUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check if the mobile already exists
    const existingMobileUser = await User.findOne({
      where: {
        mobile,
      },
    });

    if (existingMobileUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User with this mobile number already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      mobile,
      first_name,
      last_name,
      gender,
      role,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
}

  // Create a new user with avatar upload
  static async create(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const { name, email, password, role } = req.body;

        // Get avatar file path if uploaded
        const avatar = req.file ? `avatars/${req.file.filename}` : null;

        const user = await User.create({
          name,
          email,
          password,
          role,
          avatar,
        });

        return res.status(StatusCodes.CREATED).json({
          success: true,
          message: "User created successfully",
          data: user,
        });
      } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
      }
    });
  }
}

module.exports = AuthController;
