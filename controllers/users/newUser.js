const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const { v4: uuid } = require("uuid");

const { generateError, sendMail } = require("../../helpers");

const { ENLACE_VALIDACION } = process.env;

const newUser = async (req, res, next) => {
  try {
    // Obtenemos mediante destructuring los datos necesarios.
    const { username, email, password } = req.body;

    // Si falta algún dato lanzamos un error.
    if (!username || !email || !password) {
      throw generateError("Faltan campos", 400);
    }
    const registrationCode = uuid();

    // Creamos el usuario.
    await insertUserQuery(username, email, password, registrationCode);

    // Creamos el asunto del email de verificación.
    const subject = "Activa tu usuario en Instagram";

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
      ¡Bienvenid@ ${username}!

      Por favor, verifica tu usuario a través del siguiente enlace: <a href="${ENLACE_VALIDACION}${registrationCode}">Click para verificar</a>
  `;

    // Enviamos un email de verificación al usuario.
    await sendMail(email, emailContent);

    res.send({
      status: "ok",
      message:
        "Usuario creado. Por favor, verifique su identidad a través del email que recibirá en su correo electrónico",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
