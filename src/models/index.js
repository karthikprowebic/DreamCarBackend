// models/index.js
const { sequelize } = require('../config/database');

// Import models in order of dependency
const User = require('./User.model');
const File = require('./File.model');
const Menu = require('./Menu.model');
const MyField = require('./MyField.model');
const {
  Vehicle,
  VehicleType,
  Category,
  Brand,
  Feature,
  VehicleImage,
  VehicleFeature,
  Vendor,
  Order
} = require('./vehicle.model');

// Define associations
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Initialize associations
Object.values([
  User,
  Order,
  File,
  Menu,
  MyField,
  Vehicle,
  VehicleType,
  Category,
  Brand,
  Feature,
  VehicleImage,
  VehicleFeature,
  Vendor
]).forEach((model) => {
  if (model.associate) {
    model.associate({ 
      User,
      Order,
      File,
      Menu,
      MyField,
      Vehicle,
      VehicleType,
      Category,
      Brand,
      Feature,
      VehicleImage,
      VehicleFeature,
      Vendor
    });
  }
});

// Export all models
module.exports = {
  sequelize,
  User,
  Order,
  File,
  Menu,
  MyField,
  Vehicle,
  VehicleType,
  Category,
  Brand,
  Feature,
  VehicleImage,
  VehicleFeature,
  Vendor
};
