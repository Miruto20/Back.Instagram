const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostByIdUserQuery = async (idUser, idUserLogged) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.text, P.image, P.place, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS rate,  P.idUser = ? AS owner, Bit_OR (R.idUser = ?) AS ratedByMe, MAX(R2.value) valueRated, P.createdAt, P.id, P.updatedAt
                FROM post P
                INNER JOIN user U ON P.idUser = U.id
                LEFT JOIN rate R ON P.id = R.idPost
                LEFT JOIN rate R2 ON (P.id = R2.idPost AND R2.idUser = ?)
                WHERE U.id = ?
                GROUP BY P.id
            `,
      [idUser, idUser, idUserLogged, idUser]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ningun post", 404);
    }

    return posts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPostByIdUserQuery;
