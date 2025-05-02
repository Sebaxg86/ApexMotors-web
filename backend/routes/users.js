const express = require('express');
const router = express.Router();
const { getUsers, createUser, loginUser } = require('../controllers/usersController');

// Ruta para obtener todos los usuarios
router.get('/', getUsers);

// Ruta para crear un usuario
router.post('/', createUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

module.exports = router;