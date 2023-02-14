const selectAllPostsQuery = require("../../bbdd/queries/posts/selectAllPostsQuery");

const listPosts = async (req, res, next) => {
  try {
    // Obtenemos la palabra que queremos filtrar.
    const { keyword } = req.query;

    const idUser = req.user.id;

    const posts = await selectAllPostsQuery(idUser, keyword);

    res.send({
      status: "ok",
      data: {
        posts,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listPosts;
