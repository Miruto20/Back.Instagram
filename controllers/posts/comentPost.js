const selectPostByIdQuery = require("../../bbdd/queries/posts/selectPostByIdQuery");
const insertComentQuery = require("../../bbdd/queries/posts/insertComentQuery");

const { generateError } = require("../../helpers");

const comentPost = async (req, res, next) => {
  try {
    const { idPost } = req.params;

    const { text } = req.body;

    if (!text) {
      throw generateError("Faltan campos", 400);
    }
    // Obtenemos el post.
    const post = await selectPostByIdQuery(idPost);

    //Esta funcionalidad decidimos al analizar el proyecto desactivarla y dejar a los dueños del post comentar su propio post
    // Si somos los dueños del post restringimos el comentario
    /*    if (post.idUser === req.user.id) {
      throw generateError("No puedes comentar tu propio post", 403);
    } */

    const timestamp = new Date();

    // Comentamos el post.
    await insertComentQuery(text, req.user.id, idPost, timestamp);
    // Obtenemos el post.
    const postComent = await selectPostByIdQuery(idPost);

    res.send({
      status: "ok",
      message: "Comentario enviado",
      createdAt: timestamp,
      data: { postComent },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = comentPost;
