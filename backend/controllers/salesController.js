const oracledb = require('oracledb');

// Obtener todas las ventas
const getSales = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      SELECT 
        s.id AS sale_id,
        c.full_name AS client_name,
        car.brand || ' ' || car.model AS car_name,
        s.total_price,
        TO_CHAR(s.sale_date, 'DD-MM-YYYY HH24:MI:SS') AS sale_date
      FROM SALES s
      JOIN CLIENTS c ON s.client_id = c.id
      JOIN CARS car ON s.car_id = car.id
      ORDER BY s.sale_date DESC
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    await connection.close();

    res.status(200).json(result.rows); // Enviar las ventas como JSON
  } catch (err) {
    console.error("Error al obtener ventas:", err);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

// Registrar una venta
const registerSale = async (req, res) => {
  const { clientId, carId } = req.body;

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234', 
      connectString: 'apexmotors_high',
    });

    const transactionQuery = `
      BEGIN
        -- Insertar la nueva venta en SALES
        INSERT INTO SALES (client_id, car_id, total_price)
        VALUES (:clientId, :carId, (SELECT cost FROM CARS WHERE id = :carId_1));

        -- Actualizar el stock del auto
        UPDATE CARS
        SET stock = stock - 1
        WHERE id = :carId_2;

        -- Eliminar el auto si el stock llega a 0
        DELETE FROM CARS
        WHERE id = :carId_3 AND stock = 0;

        -- Actualizar estadísticas del cliente
        UPDATE CLIENTS
        SET cars_purchased = cars_purchased + 1,
            total_spent = total_spent + (SELECT cost FROM CARS WHERE id = :carId_4)
        WHERE id = :clientId_2;

        COMMIT;
      END;
    `;

    
    await connection.execute(
      transactionQuery,
      {
        clientId,
        carId,
        carId_1: carId,
        carId_2: carId,
        carId_3: carId,
        carId_4: carId,
        clientId_2: clientId,
      },
      { autoCommit: true }
    );

    await connection.close();

    res.status(201).json({ message: "Venta registrada exitosamente" });
  } catch (err) {
    console.error("Error al registrar venta:", err);
    res.status(500).json({ error: "Error al registrar venta" });
  }
};

// Eliminar una venta
const deleteSale = async (req, res) => {
  const { saleId } = req.params; // ID de la venta que se eliminará

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const transactionQuery = `
      DECLARE
        v_client_id NUMBER;
        v_car_id NUMBER;
        v_total_price NUMBER;
      BEGIN
        -- Obtener datos de la venta
        SELECT client_id, car_id, total_price
        INTO v_client_id, v_car_id, v_total_price
        FROM SALES
        WHERE id = :saleId;

        -- Devolver el stock del auto
        UPDATE CARS
        SET stock = stock + 1
        WHERE id = v_car_id;

        -- Actualizar estadísticas del cliente
        UPDATE CLIENTS
        SET cars_purchased = cars_purchased - 1,
            total_spent = total_spent - v_total_price
        WHERE id = v_client_id;

        -- Eliminar la venta
        DELETE FROM SALES
        WHERE id = :saleId;

        COMMIT;
      END;
    `;

    await connection.execute(
      transactionQuery,
      { saleId }, // Parámetro para la venta a eliminar
      { autoCommit: true }
    );

    await connection.close();

    res.status(200).json({ message: 'Venta eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({ error: 'Error al eliminar venta' });
  }
};

module.exports = {
  getSales,
  registerSale,
  deleteSale
};