const oracledb = require('oracledb');

// Obtener todos los autos
const getCars = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    // outFormat para devolver un objeto con nombres de columnas
    const result = await connection.execute(`SELECT * FROM CARS`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener autos:', err);
    res.status(500).json({ error: 'Error al obtener autos' });
  }
};

// Crear un nuevo auto
const createCar = async (req, res) => {
  const { brand, model, year, cost, stock } = req.body;

  if (!brand || !model || !year || !cost || !stock) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      INSERT INTO CARS (brand, model, year, cost, stock)
      VALUES (:brand, :model, :year, :cost, :stock)
    `;

    await connection.execute(query, [brand, model, year, cost, stock], { autoCommit: true });
    await connection.close();

    res.status(201).json({ message: 'Auto creado exitosamente' });
  } catch (err) {
    console.error('Error al crear auto:', err);
    res.status(500).json({ error: 'Error al crear auto' });
  }
};

// Actualizar un auto existente
const updateCar = async (req, res) => {
  const { id } = req.params;
  const { brand, model, year, cost, stock } = req.body;

  if (!id || !brand || !model || !year || !cost || !stock) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      UPDATE CARS
      SET brand = :brand, model = :model, year = :year, cost = :cost, stock = :stock
      WHERE id = :id
    `;

    await connection.execute(query, [brand, model, year, cost, stock, id], { autoCommit: true });
    await connection.close();

    res.status(200).json({ message: 'Auto actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar auto:', err);
    res.status(500).json({ error: 'Error al actualizar auto' });
  }
};

// Eliminar un auto
const deleteCar = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El ID es obligatorio' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const transactionQuery = `
      BEGIN
        FOR sale IN (
          SELECT client_id, total_price 
          FROM SALES 
          WHERE car_id = :carId
        ) LOOP
          -- Actualizar estadísticas del cliente
          UPDATE CLIENTS
          SET 
            cars_purchased = cars_purchased - 1,
            total_spent = total_spent - sale.total_price
          WHERE id = sale.client_id;
        END LOOP;

        -- Eliminar las ventas relacionadas con el auto
        DELETE FROM SALES WHERE car_id = :carId;

        -- Eliminar el auto
        DELETE FROM CARS WHERE id = :carId;

        COMMIT;
      END;
    `;

    await connection.execute(
      transactionQuery,
      { carId: id },
      { autoCommit: true }
    );

    await connection.close();

    res.status(200).json({ message: 'Auto eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar auto:', err);
    res.status(500).json({ error: 'Error al eliminar auto' });
  }
};

// Obtener estadísticas del inventario
const getInventoryStats = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const statsQuery = `
      SELECT 
        SUM(stock) AS total_cars,
        SUM(cost * stock) AS total_value
      FROM CARS
    `;

    const result = await connection.execute(statsQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await connection.close();

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener estadísticas del inventario:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas del inventario' });
  }
};

module.exports = {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getInventoryStats,
};