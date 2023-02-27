const selectPostsByTopQuery = require("../../bbdd/queries/posts/selectPostsByTopQuery");

const getTopPosts = async (req, res, next) => {
  try {
    // Obtenemos la palabra que queremos filtrar.
    const { keyword } = req.query;

    const idUser = req.user.id;

    const posts = await selectPostsByTopQuery(idUser, keyword);

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
module.exports = getTopPosts;
