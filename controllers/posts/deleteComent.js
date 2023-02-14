const deleteComentQuery = require("../../bbdd/queries/posts/deleteComentQuery");
const deleteComent = async (req, res, next) => {
  try {
    const { idComent } = req.params;
    const idUser = req.user.id;

    // Eliminamos el comentario.
    await deleteComentQuery(idUser, idComent);

    res.send({
      status: "ok",
      message: "Comentario eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteComent;
