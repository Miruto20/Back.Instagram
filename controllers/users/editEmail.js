const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const updateUserEmailQuery = require("../../bbdd/queries/users/updateUserEmailQuery");
const bcrypt = require("bcrypt");
const updateUserRecEmailQuery = require("../../bbdd/queries/users/updateUserRecEmailQuery");

const { generateError } = require("../../helpers");

const editEmail = async (req, res, next) => {
  try {
    const { recoverEmailCode, password, email, newEmail } = req.body;

    if (!recoverEmailCode || !password || !newEmail || !email) {
      throw generateError("Faltan campos", 400);
    }

    // Localizamos al usuario con el email del body.
    const user = await selectUserByEmailQuery(email);

    const username = user.username;

    // Comprobamos si las contraseñas coinciden. El método "compare" retorna
    // true o false en función de si las contraseñas coinciden o no.
    const validPassword = await bcrypt.compare(password, user.password);

    // Si la contraseña es incorrecta lanzamos un error.
    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }

    //Compruebo codigo de email de usuario correcto, compruebo y lo vuelvo a poner a null
    await updateUserRecEmailQuery(recoverEmailCode);

    // Actualizamos el email del usuario.
    await updateUserEmailQuery(email, newEmail);

    res.send({
      status: "ok",
      message: "Usuario actualizado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editEmail;
