const deletePostQuery = require("../../bbdd/queries/posts/deletePostQuery");
const deletePost = async (req, res, next) => {
  try {
    const { idPost } = req.params;
    const idUser = req.user.id;

    // Eliminamos el post.
    await deletePostQuery(idUser, idPost);

    res.send({
      status: "ok",
      message: "Post eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deletePost;
