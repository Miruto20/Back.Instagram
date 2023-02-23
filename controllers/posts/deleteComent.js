const deleteComentQuery = require("../../bbdd/queries/posts/deleteComentQuery");
const selectPostByIdQuery = require("../../bbdd/queries/posts/selectPostByIdQuery");
const deleteComent = async (req, res, next) => {
  try {
    const { idComent } = req.params;
    const idUser = req.user.id;
    const { idPost } = req.body;

    // Eliminamos el comentario.
    await deleteComentQuery(idUser, idComent);

    // Obtenemos el post. para cargarlo de nuevo
    const postComent = await selectPostByIdQuery(idPost);

    res.send({
      status: "ok",
      message: "Comentario eliminado",
      data: { postComent },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteComent;
