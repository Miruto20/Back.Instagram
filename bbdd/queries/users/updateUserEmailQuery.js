const getConnection = require("../../getConnection");

const updateUserEmailQuery = async (email, newEmail) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE user SET email = ?, modifiedAt = ? WHERE email = ?`,
      [newEmail, new Date(), email]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserEmailQuery;
