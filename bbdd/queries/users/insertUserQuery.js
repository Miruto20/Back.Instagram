const getConnection = require("../../getConnection");

const bcrypt = require("bcrypt");

const { generateError } = require("../../../helpers");

const insertUserQuery = async (username, email, password, registrationCode) => {
  let connection;

  try {
    connection = await getConnection();

    // Intentamos obtener a un usuario con el email o el nombre de usuario dado.
    const [users] = await connection.query(
      `SELECT id FROM user WHERE username = ? OR email = ?`,
      [username, email]
    );

    // Si existe algún usuario con ese email lanzamos un error.
    if (users.length > 0) {
      throw generateError("Ya existe un usuario con ese email", 403);
    }

    // Encriptamos la contraseña.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el usuario en la base de datos.
    await connection.query(
      `INSERT INTO user (username, email, password, registrationCode, createdAt)
        VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, registrationCode, new Date()]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertUserQuery;
