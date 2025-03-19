const { Sequelize, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User.model');

// VehicleType Model
const VehicleType = sequelize.define('VehicleType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING(250) },
}, { 
  modelName: 'VehicleType', 
  tableName: 'vehicle_types', 
  timestamps: true, 
  underscored: true 
});

// Category Model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_type_id: { 
    type: DataTypes.INTEGER, 
    references: { model: 'vehicle_types', key: 'id' },
    allowNull: false,
    validate: {
      notNull: { msg: 'Vehicle type is required' }
    }
  },
  name: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category name cannot be empty' },
      len: {
        args: [2, 50],
        msg: 'Category name must be between 2 and 50 characters'
      }
    }
  },
  description: { 
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Description cannot exceed 1000 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false
  }
}, { 
  modelName: 'Category', 
  tableName: 'categories', 
  timestamps: true, 
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['name', 'vehicle_type_id'],
      name: 'categories_name_vehicle_type_unique'
    }
  ]
});

// Brand Model
const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },

  logo_url: { 
    type: DataTypes.STRING(250) 
  },

}, { 
  modelName: 'Brand', 
  tableName: 'brands', 
  timestamps: true, 
  underscored: true 
});

// Feature Model
const Feature = sequelize.define('Feature', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_type_id: { type: DataTypes.INTEGER, references: { model: VehicleType, key: 'id' } },
  name: { type: DataTypes.STRING(100), allowNull: false },
  icon: { type: DataTypes.STRING(250) },
}, { 
  modelName: 'Feature', 
  tableName: 'features', 
  timestamps: true, 
  underscored: true 
});

// Vendor Model
const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  alternate_phone: DataTypes.STRING(20),
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: DataTypes.STRING(100),
  state: DataTypes.STRING(100),
  pincode: DataTypes.STRING(10),
  gst_number: {
    type: DataTypes.STRING(15),
    unique: true,
  },
  pan_number: {
    type: DataTypes.STRING(10),
    unique: true,
  },
  bank_account_number: DataTypes.STRING(50),
  bank_name: DataTypes.STRING(100),
  ifsc_code: DataTypes.STRING(20),
  commission_percentage: DataTypes.DECIMAL(5, 2),
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  agreement_start_date: DataTypes.DATE,
  agreement_end_date: DataTypes.DATE,
  kyc_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    validate: { min: 0, max: 5 },
  },
  total_vehicles: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  modelName: 'Vendor',
  tableName: 'vendors',
  underscored: true,
  timestamps: true,
});

// Vehicle Model
const Vehicle = sequelize.define('Vehicle', {
  // Basic Information
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_type_id: { 
    type: DataTypes.INTEGER, 
    references: { model: VehicleType, key: 'id' },
    allowNull: false
  },
  category_id: { 
    type: DataTypes.INTEGER, 
    references: { model: Category, key: 'id' },
    allowNull: false
  },
  brand_id: { 
    type: DataTypes.INTEGER, 
    references: { model: Brand, key: 'id' },
    allowNull: false
  },
  vendor_id: { 
    type: DataTypes.INTEGER, 
    references: { model: Vendor, key: 'id' },
    allowNull: false
  },
  vendor_user_id: { 
    type: DataTypes.INTEGER, 
    // references: { model: Vendor, key: 'id' },
    // allowNull: false
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  number_plate: { 
    type: DataTypes.STRING(20), 
    allowNull: false, 
    unique: true,
    validate: {
      notEmpty: true
    }
  },

  // Vehicle Specifications
  model_year: { 
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  color: { 
    type: DataTypes.STRING(50),
    validate: {
      notEmpty: true
    }
  },
  engine_capacity: { 
    type: DataTypes.STRING(50),
    validate: {
      notEmpty: true
    }
  },
  fuel_type: { 
    type: DataTypes.ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'),
    allowNull: false
  },
  transmission_type: { 
    type: DataTypes.ENUM('Manual', 'Automatic', 'CVT'),
    allowNull: false
  },
  mileage: { 
    type: DataTypes.DECIMAL(5, 2),
    validate: {
      min: 0
    }
  },
  seating_capacity: { 
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 50
    }
  },

  // Bike Specific Fields
  bike_type: { 
    type: DataTypes.ENUM('Standard', 'Cruiser', 'Sports', 'Touring', 'Scooter')
  },
  engine_cc: { 
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  starter_type: { 
    type: DataTypes.ENUM('Kick', 'Self', 'Both')
  },

  // Rental Information
  status: { 
    type: DataTypes.ENUM('Available', 'Booked', 'Maintenance', 'Inactive'), 
    defaultValue: 'Available',
    allowNull: false
  },
  hourly_rate: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  daily_rate: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  weekly_rate: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  monthly_rate: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  security_deposit: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  minimum_rental_period: { 
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },

  // Driver Information
  with_driver_available: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false
  },
  driver_name: { 
    type: DataTypes.STRING(100),
    validate: {
      isValidDriverInfo(value) {
        if (this.with_driver_available && !value) {
          throw new Error('Driver name is required when driver service is available');
        }
      }
    }
  },
  driver_phone: { 
    type: DataTypes.STRING(15),
    validate: {
      isValidDriverInfo(value) {
        if (this.with_driver_available && !value) {
          throw new Error('Driver phone is required when driver service is available');
        }
      }
    }
  },
  driver_license_number: { 
    type: DataTypes.STRING(50),
    validate: {
      isValidDriverInfo(value) {
        if (this.with_driver_available && !value) {
          throw new Error('Driver license is required when driver service is available');
        }
      }
    }
  },
  driver_rate_per_day: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0,
      isValidDriverRate(value) {
        if (this.with_driver_available && !value) {
          throw new Error('Driver rate is required when driver service is available');
        }
      }
    }
  },

  // Maintenance and Documentation
  registration_expiry: { 
    type: DataTypes.DATE,
    validate: {
      isAfterToday(value) {
        if (value && value < new Date()) {
          throw new Error('Registration expiry date must be in the future');
        }
      }
    }
  },
  insurance_expiry: { 
    type: DataTypes.DATE,
    validate: {
      isAfterToday(value) {
        if (value && value < new Date()) {
          throw new Error('Insurance expiry date must be in the future');
        }
      }
    }
  },
  last_maintenance_date: { 
    type: DataTypes.DATE
  },
  next_maintenance_due: { 
    type: DataTypes.DATE,
    validate: {
      isAfterLastMaintenance(value) {
        if (value && this.last_maintenance_date && value <= this.last_maintenance_date) {
          throw new Error('Next maintenance date must be after last maintenance date');
        }
      }
    }
  },

  // Location Information
  current_location_address: { 
    type: DataTypes.TEXT,
    allowNull: false
  },
  pickup_location: { 
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: { 
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: { 
    type: DataTypes.STRING(100),
    allowNull: false
  },
  latitude: { 
    type: DataTypes.DECIMAL(10, 8),
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: { 
    type: DataTypes.DECIMAL(11, 8),
    validate: {
      min: -180,
      max: 180
    }
  },

  // Statistics and Metrics
  total_bookings: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total_revenue: { 
    type: DataTypes.DECIMAL(12, 2), 
    defaultValue: 0.0,
    validate: {
      min: 0
    }
  },
  average_rating: { 
    type: DataTypes.DECIMAL(3, 2), 
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  total_kilometers: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0.0,
    validate: {
      min: 0
    }
  },
  main_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Main display image URL for the vehicle'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    },
    comment: 'Array of image URLs ["url1", "url2", ...]'
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of feature name and icon [{"feature1":"icon1"}, {"feature2":"icon2"}, ...]'
  
  }
}, { 
  modelName: 'Vehicle', 
  tableName: 'vehicles', 
  timestamps: true, 
  underscored: true,
  indexes: [
    {
      name: 'idx_vehicle_status',
      fields: ['status']
    },
    {
      name: 'idx_vehicle_city_state',
      fields: ['city', 'state']
    },
    {
      name: 'idx_vehicle_vendor',
      fields: ['vendor_id']
    },
    {
      name: 'idx_vehicle_type_category',
      fields: ['vehicle_type_id', 'category_id']
    }
  ]
});

// Define scopes after all model definitions
Vehicle.addScope('available', {
  where: {
    status: 'Available'
  }
});

Vehicle.addScope('withDriver', {
  where: {
    with_driver_available: true
  }
});

Vehicle.addScope('needsMaintenance', {
  where: {
    next_maintenance_due: {
      [Op.lte]: new Date()
    }
  }
});

// Instance Methods
Vehicle.prototype.isAvailable = function() {
  return this.status === 'Available';
};

Vehicle.prototype.needsMaintenance = function() {
  return this.next_maintenance_due && this.next_maintenance_due <= new Date();
};

Vehicle.prototype.calculateRentalPrice = function(days) {
  if (days >= 30) return this.monthly_rate;
  if (days >= 7) return (days / 7) * this.weekly_rate;
  if (days >= 1) return days * this.daily_rate;
  return Math.ceil(days * 24) * this.hourly_rate;
};

// VehicleImage Model
const VehicleImage = sequelize.define('VehicleImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_id: { 
    type: DataTypes.INTEGER,
    references: { model: 'vehicles', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  image_url: { type: DataTypes.STRING(255), allowNull: false },
  image_type: {
    type: DataTypes.ENUM('exterior', 'interior', 'document'),
    defaultValue: 'exterior'
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { 
  modelName: 'VehicleImage', 
  tableName: 'vehicle_images', 
  timestamps: true, 
  underscored: true 
});

// VehicleFeature Model
const VehicleFeature = sequelize.define('VehicleFeature', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_id: { type: DataTypes.INTEGER, references: { model: Vehicle, key: 'id' } },
  feature_id: { type: DataTypes.INTEGER, references: { model: Feature, key: 'id' } },
}, { modelName: 'VehicleFeature', tableName: 'vehicle_features', timestamps: true, underscored: true });

// Add many-to-many associations between Vehicle and Feature
Vehicle.belongsToMany(Feature, { through: VehicleFeature, foreignKey: 'vehicle_id' });
Feature.belongsToMany(Vehicle, { through: VehicleFeature, foreignKey: 'feature_id' });

// Order Model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'id' },
    allowNull: false
  },
  order_number: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterToday(value) {
        if (value && value < new Date()) {
          throw new Error('Start date must be in the future');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStartDate(value) {
        if (value && value <= this.start_date) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  vendor_id: { type: DataTypes.INTEGER, },
  vendor_user_id: { type: DataTypes.INTEGER, },
  pickup_location: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dropoff_location: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'cash'),
    defaultValue: 'cash',
    allowNull: false
  },
  payment_intent_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'partial', 'paid', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.STRING(50)
  },
  special_requests: {
    type: DataTypes.TEXT
  },
  driver_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  insurance_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cancellation_reason: {
    type: DataTypes.TEXT
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_order_status',
      fields: ['status']
    },
    {
      name: 'idx_order_dates',
      fields: ['start_date', 'end_date']
    }
  ]
});

// OrderItem Model for individual vehicles in an order
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: { model: 'orders', key: 'id' },
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    references: { model: 'vehicles', key: 'id' },
    allowNull: false
  },
  vehicle_type_id: {
    type: DataTypes.INTEGER,
    references: { model: 'vehicle_types', key: 'id' },
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  rate_type: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'daily'
  },
  rate_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  total_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    comment: 'Number of hours/days/weeks/months based on rate_type'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  insurance_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  driver_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: true,
  underscored: true
});

// Add Order-related associations
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
OrderItem.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id' });

// Add Order instance methods
Order.prototype.calculateTotalAmount = async function() {
  const orderItems = await OrderItem.findAll({
    where: { order_id: this.id }
  });
  
  const total = orderItems.reduce((sum, item) => {
    return sum + Number(item.subtotal) + Number(item.insurance_fee) + Number(item.driver_fee);
  }, 0);
  
  this.total_amount = total;
  await this.save();
  return total;
};

// Add User-Order association
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Associations
VehicleType.hasMany(Category, { foreignKey: 'vehicle_type_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Category.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id' });

Vendor.hasMany(Vehicle, { foreignKey: 'vendor_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Vehicle.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Brand.hasMany(Vehicle, { foreignKey: 'brand_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Vehicle.belongsTo(Brand, { foreignKey: 'brand_id' });

VehicleType.hasMany(Vehicle, { foreignKey: 'vehicle_type_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Vehicle.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id', as: 'vehicle_type' });

Category.hasMany(Vehicle, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Vehicle.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Vehicle.hasMany(VehicleImage, { foreignKey: 'vehicle_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

Vehicle.hasMany(VehicleFeature, { foreignKey: 'vehicle_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
VehicleFeature.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

Feature.hasMany(VehicleFeature, { foreignKey: 'feature_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
VehicleFeature.belongsTo(Feature, { foreignKey: 'feature_id' });

// Coupon Model
const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      max(value) {
        if (this.type === 'percentage' && value > 100) {
          throw new Error('Percentage discount cannot be more than 100%');
        }
      }
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterToday(value) {
        if (value && new Date(value) < new Date()) {
          throw new Error('Start date must be after today');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value && new Date(value) < new Date(this.start_date)) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  min_rental_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  max_rental_days: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      isGreaterThanMin(value) {
        if (value && value < this.min_rental_days) {
          throw new Error('Max rental days must be greater than min rental days');
        }
      }
    }
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  used_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  vehicle_type_id: {
    type: DataTypes.INTEGER,
    references: { model: 'vehicle_types', key: 'id' }
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: { model: 'categories', key: 'id' }
  },
  brand_id: {
    type: DataTypes.INTEGER,
    references: { model: 'brands', key: 'id' }
  },
  min_amount: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  max_discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  modelName: 'Coupon',
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (coupon) => {
      if (coupon.end_date < coupon.start_date) {
        throw new Error('End date must be after start date');
      }
    },
    beforeSave: async (coupon) => {
      if (coupon.used_count >= coupon.usage_limit) {
        coupon.status = 'expired';
      }
      if (new Date() > new Date(coupon.end_date)) {
        coupon.status = 'expired';
      }
    }
  }
});

// Add associations
Coupon.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id' });
Coupon.belongsTo(Category, { foreignKey: 'category_id' });
Coupon.belongsTo(Brand, { foreignKey: 'brand_id' });

// Instance methods
Coupon.prototype.isValid = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    now >= this.start_date &&
    now <= this.end_date &&
    this.used_count < this.usage_limit
  );
};

Coupon.prototype.calculateDiscount = function(amount) {
  if (!this.isValid()) {
    throw new Error('Coupon is not valid');
  }

  if (this.min_amount && amount < this.min_amount) {
    throw new Error(`Minimum amount required: ${this.min_amount}`);
  }

  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
  } else {
    discount = this.value;
  }

  if (this.max_discount_amount && discount > this.max_discount_amount) {
    discount = this.max_discount_amount;
  }

  return discount;
};

module.exports = {
  VehicleType,
  Category,
  Brand,
  Feature,
  Vendor,
  Vehicle,
  VehicleImage,
  VehicleFeature,
  Order,
  OrderItem,
  Coupon
};