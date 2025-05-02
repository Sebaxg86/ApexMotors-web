const express = require('express');
const router = express.Router();
const { getCars, createCar, updateCar, deleteCar, getInventoryStats } = require('../controllers/carsController');

// Ruta para obtener todos los autos
router.get('/', getCars);

// Ruta para crear un nuevo auto
router.post('/', createCar);

// Ruta para actualizar un auto existente
router.put('/:id', updateCar);

// Ruta para eliminar un auto
router.delete('/:id', deleteCar);

// Ruta para obtener estadísticas del inventario
router.get('/stats', getInventoryStats);

module.exports = router;