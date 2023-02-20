const insertPostQuery = require("../../bbdd/queries/posts/insertPostQuery");

const { generateError, savePhoto } = require("../../helpers");

const newPost = async (req, res, next) => {
  try {
    const { image, place, text } = req.body;

    if (!place || !text) {
      throw generateError("Faltan campos", 400);
    }

    const timestamp = new Date();

    let imageName, idPost;

    const idUser = req.user.id;

    // Si "req.files" tiene fotos las guardamos.
    if (req.files && Object.keys(req.files).length > 0) {
      // Recorremos las fotos y nos quedamos con la foto(Si cambiamos el slice, nos permitiria seleccionar el numero de imagenes que le permitamos subir)
      // Habría que modificar la base de datos y el req. de este endpoint

      for (const photoData of Object.values(req.files).slice(0, 1)) {
        imageName = await savePhoto(photoData, 1);
        // Guardamos la foto en la base de datos(lo hacemos con un For por si añadimos la posibilidad de mas fotos en el futuro)

        // Insertamos el post y obtenemos el id que se le ha asignado en la base de datos.
        idPost = await insertPostQuery(
          imageName,
          place,
          text,
          timestamp,
          idUser
        );
      }
    }

    res.send({
      status: "ok",
      data: {
        post: {
          imageName,
          place,
          text,
          idUser: req.user.id,
          createdAt: timestamp,
        },
      },
      idPost,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newPost;
