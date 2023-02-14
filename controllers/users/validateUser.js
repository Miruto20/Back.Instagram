const updateUserRegCodeQuery = require("../../bbdd/queries/users/updateUserRegCodeQuery");

const validateUser = async (req, res, next) => {
  try {
    const { registrationCode } = req.params;

    await updateUserRegCodeQuery(registrationCode);

    res.send({
      status: "ok",
      message: "Usuario activado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = validateUser;
