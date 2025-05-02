const express = require('express');
const router = express.Router();
const { getSales, registerSale, deleteSale } = require('../controllers/salesController');

// Ruta para obtener todas las ventas
router.get("/get-sales", getSales);

// Ruta para registrar una nueva venta
router.post("/register-sale", registerSale);

// Ruta para eliminar una venta
router.delete('/:saleId', deleteSale);

module.exports = router;