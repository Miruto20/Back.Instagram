const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const updateRecoverEmailQuery = require("../../bbdd/queries/users/updateRecoverEmailQuery");
const randomstring = require("randomstring");

const { sendMail, generateError } = require("../../helpers");

const { ENLACE_CAMBIO_CORREO } = process.env;

const sendRecoverEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw generateError("Faltan campos", 400);
    }

    // Comprobamos que exista un usuario con ese email.
    const user = await selectUserByEmailQuery(email);

    // Generamos el código de recuperación de contraseña.
    const recoverEmailCode = randomstring.generate(9);

    // Insertamos el código de recuperación en la base de datos.
    await updateRecoverEmailQuery(recoverEmailCode, email);

    // Creamos el contenido que queremos que tenga el email de verificación.
    const emailContent = `
            Muy buenas ${user.username},
            Se ha solicitado cambiar la direccion de correo para esta cuenta de INSTAGRAM.JM. 
            Copia el siguiente código  ${recoverEmailCode} para confirmar en este enlace ${ENLACE_CAMBIO_CORREO}
            que quieres cambiar el correo de tu cuenta: 

            Si no has sido tú ignora este correo.
        `;

    // Enviar un email con el código de recuperación al usuario.
    await sendMail(email, emailContent);

    res.send({
      status: "ok",
      message:
        "Email de cambio de correo enviado, copie el codigo en su correo nuevo para poder modificarlo en editEmail",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendRecoverEmail;
