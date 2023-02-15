const getConnection = require("../../getConnection");

const bcrypt = require("bcrypt");

const { generateError } = require("../../../helpers");

const updateUserRecEmailQuery = async (recoverEmailCode) => {
  let connection;

  try {
    connection = await getConnection();

    const [users] = await connection.query(
      `SELECT id FROM user WHERE recoverEmailCode = ?`,
      [recoverEmailCode]
    );

    // Si no existe ningún usuario con ese código de recuperación lanzamos un error.
    if (users.length < 1) {
      throw generateError(
        "Código de recuperación de contraseña incorrecto",
        404
      );
    }

    // Actualizamos al usuario.
    await connection.query(
      `UPDATE user SET recoverEmailCode = null, active=true, modifiedAt = ? WHERE recoverEmailCode = ?`,
      [new Date(), recoverEmailCode]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserRecEmailQuery;
