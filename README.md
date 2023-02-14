# Instagram

- Creamos una web donde los usuarios pueden registrarse y postear imagenes.

- Cada post consta de una imagen, con una localizacion y un titulo.

- Las imagenes posteadas pueden ser comentadas y puntuadas de 1 a 5.

## Instalar

- Crear una base de datos vacía en una instancia de MySQL local.

- Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

- Ejecuta el comando`npm i` en el terminal para instalar las dependencias necesarias y las de desarrollo.

- Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

- Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

- Exporta de la carpeta proporcionada "Doc" el archivo Postman al programa Postman para poder testear los distintos endpoints.

## Base de datos

- **`user:`** id, username`*`, email`*`, password`*`, avatar, role ("admin", "normal"), registrationCode , recoverPasscode, active createdAt, bio, modifiedAt.

- **`post:`** id, text`*`, image`*` place`*`, idUser, createdAt, updatedAt.

- **`rate:`** id, value, idPost, idUser, createdAt.

- **`coments:`** id, idUser, idPost, text`*`,updatedAt, createdAt.

## Endpoints del usuario

- **POST** - ["/users"] - Crea un usuario pendiente de validar y se envía un correo de verificación.
- **PUT** - ["/users/validate/:registrationCode",] - Valida a un usuario recién registrado.
- **POST** - ["/users/login"] - Logea a un usuario retornando un token.
- **GET** - ["/users/:idUser"] - Retorna información de un usuario. `Token`
- **PUT** - ["/users/avatar"] - Permite actualizar el avatar del usuario. `Token`
- **PUT** - ["/users/password/recover"] - Envía al usuario un correo de recuperación de contraseña.
- **PUT** - ["/users/password"] - Resetea la contraseña de un usuario.
- **PUT** - ["/users/email"] - Permite editar el correo de un usuario.

## Endpoints del instagram

- **POST** - ["/posts"] - Crea un post. `Token`
- **GET** - ["/posts"] - Devuelve el listado de post, permite filtrar por keyword.
- **GET** - ["/post/:idPost"] - Devuelve un post en concreto.
- **POST** - ["/posts/:idPost/votes"] - (entre 1 y 5). `Token`
- **GET** - ["/post/:iduser"] - Obtener los posts de un usuario en concreto.
- **DELETE** - ["/posts/:idPost"] - Eliminar un post. `Token`
- **POST** - ["/posts/:idPost/coments"] - Agregar un comentario a un post. `Token`
- **DELETE** - ["/coments/:idComent"] - Eliminar un comentario del post. `Token`
