const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Menu extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

Menu.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  display: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'menus',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Menu',
  tableName: 'menus',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Menu;