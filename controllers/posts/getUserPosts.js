const selectPostByIdUserQuery = require("../../bbdd/queries/posts/selectPostByIdUserQuery");

const getUserPost = async (req, res, next) => {
  try {
    const { idUser } = req.params;

    const post = await selectPostByIdUserQuery(idUser);

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

module.exports = getUserPost;
