const getConnection = require("../../getConnection");

const insertPostQuery = async (imageName, place, text, timestamp, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    //Insertamos el post y obtenemos los datos del mismo.
    const [newPost] = await connection.query(
      `
                INSERT INTO post (text, image, place, idUser, updatedAt, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
      [text, imageName, place, idUser, timestamp, timestamp]
    );

    const [posts] = await connection.query(
      `
                SELECT P.id, P.text, P.image, U.avatar, U.username, U.email, P.place, P.idUser, AVG(IFNULL(R.value, 0)) AS rate, P.idUser = ? AS owner, P.createdAt
                FROM post P
                LEFT JOIN rate R ON P.id = R.idPost
                LEFT JOIN user U ON P.idUser = U.id
                GROUP BY P.id
                ORDER BY P.createdAt DESC

            `,
      [idUser]
    );

    // Retornamos el id que le ha asignado la base de datos al nuevo post.
    return /* newPost.insertId,  */ posts;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertPostQuery;
