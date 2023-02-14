const getConnection = require("../bbdd/getConnection");

const { generateError } = require("../helpers");

const postExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { idPost } = req.params;

    // Comprobamos que el post exista.
    const [posts] = await connection.query(`SELECT * FROM post WHERE id = ?`, [
      idPost,
    ]);

    if (posts.length < 1) {
      throw generateError("Post no encontrado", 404);
    }

    // Pasamos el control a la siguiente función controladora.
    next();
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postExists;
