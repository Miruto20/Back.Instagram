const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const selectUserByUsernameQuery = require("../../bbdd/queries/users/selectUserByUsernameQuery");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { generateError } = require("../../helpers");

const loginUser = async (req, res, next) => {
  try {
    // Obtenemos los datos necesarios.
    const { email, username, password } = req.body;

    // Si falta algún dato lanzamos un error.
    if ((!email && !username) || !password) {
      throw generateError("Faltan campos", 400);
    }

    // Localizamos al usuario con el email del body.
    let user;
    if (email) {
      user = await selectUserByEmailQuery(email);
    } else {
      user = await selectUserByUsernameQuery(username);
    }

    // Comprobamos si las contraseñas coinciden. El método compare retorna
    // true o false en función de si las contraseñas coinciden o no.
    const validPassword = await bcrypt.compare(password, user.password);

    // Si la contraseña es incorrecta lanzamos un error.
    if (!validPassword) {
      throw generateError("Contraseña incorrecta", 401);
    }

    // Si el usuario no está activado lanzamos un error.
    if (!user.active) {
      throw generateError("Usuario pendiente de verificar", 401);
    }

    // Generamos un objeto con la información que queremos añadir al token.
    const payload = {
      id: user.id,
      role: user.role,
    };

    // Generamos el token.
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "21d",
    });

    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
