const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostByIdQuery = async (idPost, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS votes, P.idUser = ? AS owner, Bit_OR (R.idUser = ?) AS ratedByMe, P.createdAt
                FROM post P
                 JOIN user U ON P.idUser = U.id
                LEFT JOIN rate R ON P.id = R.idPost 
                WHERE P.id = ?
                GROUP BY P.id
            `,
      [idUser, idUser, idPost]
    );

    const [coments] = await connection.query(
      `SELECT C.id, C.idUser, C.text, U.username, U.avatar, U.email FROM coments C
      LEFT JOIN user U ON U.id = C.idUser 
      WHERE idPost = ?`,
      [idPost]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return {
      ...posts[0],
      coments,
    };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectPostByIdQuery;
