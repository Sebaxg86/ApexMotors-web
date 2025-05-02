const express = require('express');
const router = express.Router();
const { getClients, createClient, updateClient, deleteClient, getClientPurchases, getVipClientName, getTotalClients, getLastRegistrationDate } = require('../controllers/clientsController');

// Ruta para obtener todos los clientes
router.get('/', getClients);

// Ruta para crear un cliente
router.post('/', createClient);

// Ruta para actualizar un cliente
router.put('/:id', updateClient);

// Ruta para eliminar un cliente
router.delete('/:id', deleteClient);

// Ruta para obtener las compras de un cliente específico
router.get('/:id/purchases', getClientPurchases);

// Ruta para obtener el nombre del cliente VIP
router.get('/vip-name', getVipClientName);

router.get('/total-clients', getTotalClients);

router.get('/last-registration-date', getLastRegistrationDate);

module.exports = router;