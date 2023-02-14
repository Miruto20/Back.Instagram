const getConnection = require("../../getConnection");

const { generateError, deletePhoto } = require("../../../helpers");

const deletePostQuery = async (idUser, idPost) => {
  let connection;

  try {
    connection = await getConnection();

    // Seleccionamos el post.
    const [post] = await connection.query(
      `SELECT idUser, image FROM post WHERE id = ?`,
      [idPost]
    );

    // Comprobamos si la persona que está intentando eliminar el post
    // es la propietaria del post.
    if (post[0].idUser !== idUser) {
      throw generateError("No tienes suficientes permisos", 401);
    }

    // Eliminamos la foto del disco.
    await deletePhoto(post[0].image);

    // Borramos todos los comentarios relacionados con el post que queremos
    // eliminar.
    await connection.query(`DELETE FROM coments WHERE idPost = ?`, [idPost]);

    // Borramos todos los rate relacionados con el post que queremos
    // eliminar.
    await connection.query(`DELETE FROM rate WHERE idPost = ?`, [idPost]);

    // Borramos el post.
    await connection.query(`DELETE FROM post WHERE id = ?`, [idPost]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deletePostQuery;
