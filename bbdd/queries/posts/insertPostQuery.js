const getConnection = require("../../getConnection");

const insertPostQuery = async (imageName, place, text, timestamp, idUser) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertamos el post y obtenemos los datos del mismo.
    const [newPost] = await connection.query(
      `
                INSERT INTO post (text, image, place, idUser, updatedAt, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
      [text, imageName, place, idUser, timestamp, timestamp]
    );

    // Retornamos el id que le ha asignado la base de datos al nuevo post.
    return newPost.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertPostQuery;
