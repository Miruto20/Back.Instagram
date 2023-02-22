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

    const [coments] = await connection.query(
      `SELECT C.id, C.idUser, C.text, U.username, U.avatar, U.email FROM coments C
      LEFT JOIN user U ON U.id = C.idUser 
      WHERE idPost = ?`,
      [idPost]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertComentQuery;
