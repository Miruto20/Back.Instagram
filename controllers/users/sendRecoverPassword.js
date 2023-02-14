const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const updateRecoverPassQuery = require("../../bbdd/queries/users/updateRecoverPassQuery");
const randomstring = require("randomstring");

const { sendMail, generateError } = require("../../helpers");

const sendRecoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw generateError("Faltan campos", 400);
    }

    // Comprobamos que exista un usuario con ese email.
    const user = await selectUserByEmailQuery(email);

    // Generamos el código de recuperación de contraseña.
    const recoverPassCode = randomstring.generate(9);

    // Insertamos el código de recuperación en la base de datos.
    await updateRecoverPassQuery(recoverPassCode, email);

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
           <p> Muy buenas ${user.username},
            Se ha solicitado la recuperación de contraseña para este email en INSTAGRAM.JM:
            <a href="${process.env.ENLACE_CAMBIO_CONTRASENA}${recoverPassCode}"> Click aquí </a></p>
           <p> Si no has sido tú ignora este correo.</p>
           
        `;

    // Enviar un email con el código de recuperación al usuario.
    await sendMail(email, emailContent);

    res.send({
      status: "ok",
      message: "Email de recuperación de contraseña enviado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendRecoverPassword;
