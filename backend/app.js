const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');
const path = require('path');

// Inicializa el cliente de Oracle
oracledb.initOracleClient({
  libDir: path.join(__dirname, 'Instant client'), //Ruta de Oracle Instant Client
});

// Configura el TNS_ADMIN para usar el wallet
process.env.TNS_ADMIN = path.join(__dirname, 'Wallet_ApexMotors'); //Ruta de la wallet de Oracle

// Crear la aplicación Express
const app = express();

// Importar rutas
const userRoutes = require('./routes/users');
const carRoutes = require('./routes/cars');
const clientRoutes = require('./routes/clients');
const salesRoutes = require('./routes/sales');

// Configurar middleware
app.use(cors()); // Permitir solicitudes CORS
app.use(bodyParser.json()); // Procesar datos en formato JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', salesRoutes);

// Ruta para probar
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  //Mensaje de prueba
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});