const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const insertVoteQuery = async (value, idUser, idPost, timestamp) => {
  let connection;

  try {
    connection = await getConnection();

    // Comprobamos si el usuario ya ha votado este post.
    const [votes] = await connection.query(
      `SELECT id FROM rate WHERE idUser = ? AND idPost = ?`,
      [idUser, idPost]
    );

    if (votes.length > 0) {
      throw generateError("Ya has votado esta entrada", 403);
    }

    // Añadimos el voto.
    await connection.query(
      `
                INSERT INTO rate (value, idPost, idUser, createdAt) 
                VALUES (?, ?, ?, ?)
            `,
      [value, idPost, idUser, timestamp]
    );

    // calculamos la nueva media del Post

    const [[{ rate: newVotesAvg }]] = await connection.query(
      `

SELECT AVG(IFNULL(R.value, 0)) AS rate
FROM post P
LEFT JOIN rate R ON P.id=R.idPost
WHERE P.id= ?

`,
      [idPost]
    );

    return newVotesAvg;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = insertVoteQuery;
