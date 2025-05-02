const oracledb = require('oracledb');

// Obtener todos los clientes
const getClients = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const result = await connection.execute(`SELECT * FROM CLIENTS ORDER BY registration_date DESC`,[], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Crear un cliente
const createClient = async (req, res) => {
  const { fullName, email, phone } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Nombre completo, email y teléfono son requeridos' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234', 
      connectString: 'apexmotors_high',
    });

    const query = `
      INSERT INTO CLIENTS (full_name, email, phone_number)
      VALUES (:fullName, :email, :phone)
    `;

    await connection.execute(query, [fullName, email, phone], { autoCommit: true });
    await connection.close();

    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (err) {
    console.error('Error al crear cliente:', err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phoneNumber } = req.body;
  console.log('Datos recibidos en el servidor:', req.body); 

  if (!id || (!fullName && !email && !phoneNumber)) {
    return res.status(400).json({ error: 'ID y al menos un campo para actualizar son requeridos' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      UPDATE CLIENTS
      SET 
        full_name = COALESCE(:fullName, full_name),
        email = COALESCE(:email, email),
        phone_number = COALESCE(:phoneNumber, phone_number)
      WHERE id = :id
    `;

    const result = await connection.execute(query, [fullName, email, phoneNumber, id], { autoCommit: true });
    await connection.close();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({ message: 'Cliente actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Eliminar un cliente
const deleteClient = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID es requerido' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234', 
      connectString: 'apexmotors_high',
    });

    const query = `DELETE FROM CLIENTS WHERE id = :id`;
    const result = await connection.execute(query, [id], { autoCommit: true });
    await connection.close();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

// Obtener las compras de un cliente
const getClientPurchases = async (req, res) => {
  const { id } = req.params; // ID del cliente pasado como parámetro

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234', 
      connectString: 'apexmotors_high',
    });

    const query = `
      SELECT 
        s.id AS sale_id,
        TO_CHAR(s.sale_date, 'DD-MM-YYYY HH24:MI:SS') AS sale_date,
        c.brand AS car_brand,
        c.brand || ' ' || c.model AS car_name,
        s.total_price AS total_price
      FROM SALES s
      JOIN CARS c ON s.car_id = c.id
      WHERE s.client_id = :id
      ORDER BY s.sale_date DESC
    `;

    const result = await connection.execute(query, [id], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay compras registradas para este cliente.' });
    }

    res.status(200).json(result.rows); // Retornamos las compras como JSON
  } catch (err) {
    console.error('Error al obtener compras del cliente:', err);
    res.status(500).json({ error: 'Error al obtener las compras del cliente.' });
  }
};

// Obtener el nombre del cliente VIP (el que más ha gastado)
const getVipClientName = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234', 
      connectString: 'apexmotors_high',
    });

    const query = `
      SELECT 
        full_name AS name
      FROM CLIENTS
      WHERE total_spent = (
        SELECT MAX(total_spent) FROM CLIENTS
      )
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay clientes registrados.' });
    }

    // Asegurarse de que la propiedad "name" exista
    if (!result.rows[0].NAME) {
      console.error('El campo "name" no está presente en el resultado.');
      return res.status(500).json({ error: 'El campo "name" no fue encontrado.' });
    }

    // Retorna el nombre del cliente VIP
    res.status(200).json({ name: result.rows[0].NAME });
  } catch (err) {
    console.error('Error al obtener cliente VIP:', err);
    res.status(500).json({ error: 'Error al obtener cliente VIP.' });
  }
};

// Obtener el total de clientes registrados
const getTotalClients = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      SELECT COUNT(*) AS total_clients FROM CLIENTS
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay clientes registrados.' });
    }

    res.status(200).json({ total_clients: result.rows[0].TOTAL_CLIENTS });
  } catch (err) {
    console.error('Error al obtener el total de clientes:', err);
    res.status(500).json({ error: 'Error al obtener el total de clientes.' });
  }
};

// Obtener la fecha del último cliente registrado
const getLastRegistrationDate = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      SELECT MAX(registration_date) AS last_registration_date FROM CLIENTS
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    if (result.rows.length === 0 || !result.rows[0].LAST_REGISTRATION_DATE) {
      return res.status(404).json({ message: 'No hay clientes registrados.' });
    }

    res.status(200).json({ last_registration_date: result.rows[0].LAST_REGISTRATION_DATE });
  } catch (err) {
    console.error('Error al obtener la fecha del último cliente registrado:', err);
    res.status(500).json({ error: 'Error al obtener la fecha del último cliente registrado.' });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientPurchases,
  getVipClientName,
  getTotalClients,
  getLastRegistrationDate,
};