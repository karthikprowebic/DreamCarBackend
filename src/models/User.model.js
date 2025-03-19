// models/User.model.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  full_name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
//add new fields
      first_name: {
      type: DataTypes.STRING(100),
      
    },
    last_name: {
      type: DataTypes.STRING(100),
      
    },
    gender: {
      type: DataTypes.STRING(100),
    
    },
    mobile_otp: {
      type: DataTypes.STRING(100),
    },
    //add new fields
  role: {
    type: DataTypes.ENUM('user', 'vendor', 'admin'),  // Define enum for role
    defaultValue: 'user',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  login_attempts: DataTypes.INTEGER,
  login_attempts_date: DataTypes.DATE,
  expiry: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
