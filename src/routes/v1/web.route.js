const express = require('express');
const WebController = require('../../controllers/web.controller');

const router = express.Router();

// Vehicle Types
router.get('/vehicle-types', WebController.getVehicleTypes);

// Brands
router.get('/brands', WebController.getBrands);

// Categories
router.get('/categories', WebController.getCategories);

// Vehicles
router.get('/vehicles', WebController.getVehicles);
router.get('/vehicles/:vehicleId', WebController.getVehicleById);

module.exports = router;
