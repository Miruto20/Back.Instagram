require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");

const { PORT, UPLOADS_DIR } = process.env;

// Creamos un servidor express.
const app = express();

// Middleware que permite conectar el backend con el frontend (evita problemas
// con las CORS).
app.use(cors());

// Middleware que indica cuál es el directorio de ficheros estáticos.
app.use(express.static(UPLOADS_DIR));

// Middleware que deserializa un body en formato "raw" creando la propiedad
// "body" en el objeto "request".
app.use(express.json());

// Middleware que deserializa un body en formato "form-data" creando la propiedad
// "files" en el objeto "request".
app.use(fileUpload());

// Middleware que nos da información acerca de la petición actual.
app.use(morgan("dev"));

/**
 * ###############################
 * ## Controladores intermedios ##
 * ###############################
 */

const isAuth = require("./middlewares/isAuth");
const postExists = require("./middlewares/postExists");

/**
 * ############################
 * ## Controladores usuario ##
 * ############################
 */

const {
  newUser,
  loginUser,
  validateUser,
  getUser,
  editAvatar,
  sendRecoverPassword,
  editPassword,
  editEmail,
  sendRecoverEmail,
} = require("./controllers/users");

// Registrar un nuevo usuario.
app.post("/users", newUser);

// Validar un usuario.
app.put("/users/validate/:registrationCode", validateUser);

// Logear un usuario y retornar un token.
app.post("/users/login", loginUser);

// Obtener info de un usuario.
app.get("/users/:idUser", isAuth, getUser);

// Editar avatar de usuario.
app.put("/users/avatar", isAuth, editAvatar);

// Enviar un email de recuperación de contraseña.
app.post("/users/password/recover", sendRecoverPassword);

// Editamos la contraseña de un usuario con un código de recuperación.
app.put("/users/password", editPassword);

// Enviar email confirmacion para editar email de usuario.
app.post("/users/email/recover", isAuth, sendRecoverEmail);

// Editamos el email de un usuario con un código de recuperación.
app.put("/users/email", editEmail);

/**
 * ##########################
 * ## Controladores posts ##
 * ##########################
 */
const {
  newPost,
  listPosts,
  getPost,
  votePost,
  getUserPosts,
  deletePost,
  comentPost,
  deleteComent,
} = require("./controllers/posts");
const getTopPosts = require("./controllers/posts/getTopPosts");

// Crear un nuevo post.
app.post("/posts", isAuth, newPost);

// Listar posts.
app.get("/posts", isAuth, listPosts);

// Listar TOP 5 posts.
app.get("/posts/top", isAuth, getTopPosts);

// Obtener un post concreto.
app.get("/post/:idPost", isAuth, getPost);

// Votar una post.
app.post("/posts/:idPost/votes", isAuth, votePost);

// Obtener los posts de un usuario concreto.
app.get("/posts/:idUser", getUserPosts);

// Eliminar un post.
app.delete("/posts/:idPost", isAuth, postExists, deletePost);

// comentar un post.
app.post("/posts/:idPost/coments", isAuth, postExists, comentPost);

// Eliminar un comentario.
app.delete("/coments/:idComent", isAuth, deleteComent);

/**
 * ##################################
 * ## Middleware Error / Not found ##
 * ##################################
 */

// Middleware de error.
app.use((err, req, res, next) => {
  // Es recomendable añadir este console.error para poder ver
  // información detallada sobre los errores que vayan ocurriendo.
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
});

// Middleware de ruta no encontrada.
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "No encontrado",
  });
});

// Ponemos el servidor a escuchar peticiones en un puerto dado.
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
