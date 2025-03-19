const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


class MyField extends Model {
  // Static method to define associations if needed in the future
  static associate(models) {
    // Define associations here if you have any, for example:
    // MyField.belongsTo(models.Category, { foreignKey: 'category_id' });
  }
}

// Initialize the model
MyField.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customFields: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    user_id: {
    type: DataTypes.INTEGER,

    }

}, {
  sequelize, // Pass the sequelize instance
  modelName: 'MyField', // Name of the model
  tableName: 'my_fields', // Explicit table name
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  underscored: true // Optional: creates snake_case columns (created_at, updated_at)
});

// Export the model to be used in other parts of your application
module.exports = MyField;

