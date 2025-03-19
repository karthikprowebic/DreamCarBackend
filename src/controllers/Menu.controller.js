const Menu = require("../models/Menu.model");
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

class MenuController {
  // Get menu items by role
  static async getByRole(req, res) {
    try {
      const { role } = req.params;

      // Validate role
      if (!['admin', 'vendor', 'user'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid role specified"
        });
      }

      const menuItems = await Menu.findAll({
        where: {
          role
        },
        attributes: ['id', 'name', 'role', 'display'],
        order: [['name', 'ASC']] // Order by name alphabetically
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        data: menuItems
      });
    } catch (error) {
      console.error('Error in getByRole:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch menu items",
        error: error.message
      });
    }
  }

  // Add new menu item
  static async create(req, res) {
    try {
      const { name, role, display } = req.body;

      // Validate required fields
      if (!name || !role) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Name and role are required fields"
        });
      }

      // Validate role
      if (!['admin', 'vendor', 'user'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid role specified"
        });
      }

      const menuItem = await Menu.create({
        name,
        role,
        display: display !== undefined ? display : true
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Menu item created successfully",
        data: menuItem
      });
    } catch (error) {
      console.error('Error in create:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create menu item",
        error: error.message
      });
    }
  }

  // Update menu item
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, role, display } = req.body;

      // Check if menu item exists
      const menuItem = await Menu.findByPk(id);
      if (!menuItem) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Menu item not found"
        });
      }

      // Validate role if provided
      if (role && !['admin', 'vendor', 'user'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid role specified"
        });
      }

      // Update fields
      await menuItem.update({
        name: name || menuItem.name,
        role: role || menuItem.role,
        display: display !== undefined ? display : menuItem.display
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Menu item updated successfully",
        data: menuItem
      });
    } catch (error) {
      console.error('Error in update:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update menu item",
        error: error.message
      });
    }
  }

  // Update menu display status
  static async updateDisplay(req, res) {
    try {
      const { id } = req.params;
      const { display } = req.body;

      // Validate display parameter
      if (display === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Display status is required"
        });
      }

      // Check if menu item exists
      const menuItem = await Menu.findByPk(id);
      if (!menuItem) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Menu item not found"
        });
      }

      // Update only the display status
      await menuItem.update({ display });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Menu display status updated successfully",
        data: menuItem
      });
    } catch (error) {
      console.error('Error in updateDisplay:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update menu display status",
        error: error.message
      });
    }
  }

  // Delete menu item
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const menuItem = await Menu.findByPk(id);
      if (!menuItem) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Menu item not found"
        });
      }

      await menuItem.destroy();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Menu item deleted successfully"
      });
    } catch (error) {
      console.error('Error in delete:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete menu item",
        error: error.message
      });
    }
  }
}

module.exports = MenuController;
