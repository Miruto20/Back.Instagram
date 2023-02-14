const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteComentQuery = async (idUser, idComent) => {
  let connection;

  try {
    connection = await getConnection();

    // Seleccionamos el comentario.
    const [coment] = await connection.query(
      `SELECT idUser FROM coments WHERE id = ?`,
      [idComent]
    );

    if (coment.length === 0) {
      throw generateError("Comentario no encontrado", 404);
    }
    // Comprobamos si la persona que está intentando eliminar el comentario
    // es la propietaria del comentario.
    if (coment[0].idUser !== idUser) {
      throw generateError("No tienes suficientes permisos", 401);
    }

    // Borramos el comentario.
    await connection.query(`DELETE FROM coments WHERE id = ?`, [idComent]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteComentQuery;
