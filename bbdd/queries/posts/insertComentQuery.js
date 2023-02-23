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

      //ahora cogemos la informacion de los posts que hay y los comentarios actualizada
    );
    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS rate, P.idUser = ? AS owner, Bit_OR (R.idUser = ?) AS ratedByMe, MAX(R2.value) valueRated, P.createdAt
                FROM post P
                LEFT JOIN user U ON P.idUser = U.id
                LEFT JOIN rate R ON P.id = R.idPost
                LEFT JOIN rate R2 ON (P.id = R2.idPost AND R2.idUser = ?)
                WHERE P.id = ?
                GROUP BY P.id
            `,
      [idUser, idUser, idUser, idPost]
    );

    const [coments] = await connection.query(
      `SELECT C.id, C.idUser, C.text, U.username, U.avatar, U.email FROM coments C
      LEFT JOIN user U ON U.id = C.idUser 
      WHERE idPost = ?`,
      [idPost]
    );
    return { ...posts[0], coments };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertComentQuery;
