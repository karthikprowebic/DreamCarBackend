// routes/fileRoutes.js
const express = require('express');
const FileController = require('../../controllers/File.controller'); 

const router = express.Router();

router.post('', FileController.create); // Endpoint to upload a file
router.delete('/:id', FileController.delete);   // Endpoint to delete a file by ID
router.patch('/:id', FileController.updateByPK);   // Endpoint to delete a file by ID
router.get('/search/:name', FileController.searchByName);   // Endpoint to delete a file by ID
router.get('', FileController.fileList);

module.exports = router;
