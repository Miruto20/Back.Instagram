const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const selectPostsByTopQuery = async (idUser, keyword = "") => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS rate, P.idUser = ? AS owner,Bit_OR (R.idUser = ?) AS ratedByMe, MAX(R2.value) valueRated, P.createdAt
                FROM post P
                LEFT JOIN rate R ON P.id = R.idPost
                LEFT JOIN user U ON P.idUser = U.id
                LEFT JOIN rate R2 ON (P.id = R2.idPost AND R2.idUser = ?)
                WHERE P.text LIKE ? OR U.username LIKE ? OR P.place LIKE ?
                GROUP BY P.id
                ORDER BY rate DESC
                LIMIT 5
            `,
      [idUser, idUser, idUser, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    if (posts.length < 1) {
      throw generateError("No se ha encontrado ninguna entrada", 404);
    }

    return posts;
  } finally {
    if (connection) connection.release();
  }
};
module.exports = selectPostsByTopQuery;
