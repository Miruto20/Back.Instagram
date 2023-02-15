const getConnection = require("../../getConnection");

const updateUserEmailQuery = async (email, newEmail, recoverEmailCode) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE user SET email = ?, active=false, recoverEmailCode = ?, modifiedAt = ? WHERE email = ?`,
      [newEmail, recoverEmailCode, new Date(), email]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserEmailQuery;
