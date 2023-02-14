const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertComentQuery = async (text, idUser, idPost, timestamp) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos el comentario.
    await connection.query(
      `
                INSERT INTO coments (idUser, idPost, text, updatedAt, createdAt) 
                VALUES (?, ?, ?, ?, ?)
            `,
      [idUser, idPost, text, timestamp, timestamp]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertComentQuery;
