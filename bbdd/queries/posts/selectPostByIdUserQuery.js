const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostByIdUserQuery = async (idUser) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.text, P.image, P.place, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS votes, P.createdAt, P.id, P.updatedAt
                FROM user U
                INNER JOIN post P ON U.id = P.idUser
                LEFT JOIN rate R ON P.id = R.idPost
                WHERE U.id = ?
                GROUP BY P.id
            `,
      [idUser]
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
