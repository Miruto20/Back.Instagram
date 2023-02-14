const selectPostByIdQuery = require("../../bbdd/queries/posts/selectPostByIdQuery");

const getPost = async (req, res, next) => {
  try {
    const { idPost } = req.params;
    const idUser = req.user.id;
    const post = await selectPostByIdQuery(idPost, idUser);

    res.send({
      status: "ok",
      data: {
        post,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getPost;
