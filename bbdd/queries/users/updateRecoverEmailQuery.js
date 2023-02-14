const getConnection = require("../../getConnection");

const updateRecoverEmailQuery = async (recoverEmailCode, email) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `UPDATE user SET recoverEmailCode = ?, modifiedAt = ? WHERE email = ?`,
      [recoverEmailCode, new Date(), email]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateRecoverEmailQuery;
