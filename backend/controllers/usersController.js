const oracledb = require('oracledb');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const result = await connection.execute(`SELECT * FROM USERS`);
    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Crear un usuario con contraseña encriptada
const createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña

    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `
      INSERT INTO USERS (email, password)
      VALUES (:email, :password)
    `;

    await connection.execute(query, [email, hashedPassword], { autoCommit: true });
    await connection.close();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Validar usuario (login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //DEPURACION-----
  console.log('Email recibido:', email); // Log del email recibido
  console.log('Password recibido:', password); // Log de la contraseña recibida
  //---------------

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'Password1234',
      connectString: 'apexmotors_high',
    });

    const query = `SELECT password FROM USERS WHERE email = :email`;
    const result = await connection.execute(query, [email]);

    //DEPURACION --------
    console.log('Resultado de la consulta:', result.rows); // Log del resultado de la consulta
    //-------------------

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hashedPassword = result.rows[0][0];
    //DEPURACION --------
    console.log('Password hash en BD:', hashedPassword); // Log del hash obtenido
    //-------------------

    const isMatch = await bcrypt.compare(password, hashedPassword);
    //DEPURACION --------
    console.log('¿Password coincide?', isMatch); // Log del resultado de la comparación
    //-------------------

    if (!isMatch) {
      console.log('Contraseña incorrecta'); // Log si la contraseña es incorrecta
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
};