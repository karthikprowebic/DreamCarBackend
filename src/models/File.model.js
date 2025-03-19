// models/User.model.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const File = sequelize.define('File', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
    user_id: {
    type: DataTypes.INTEGER,

    }

}, {
  modelName: 'File', // Name of the model
  tableName: 'files',
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  underscored: true // Optional: creates snake_case columns (created_at, updated_at)
});

module.exports = File;
