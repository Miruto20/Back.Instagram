require("dotenv").config();

// Importamos la función que retorna una conexión libre con la BBDD.
const getConnection = require("./getConnection");

const bcrypt = require("bcrypt");

const main = async () => {
  let connection;

  try {
    connection = await getConnection();

    console.log("Borrando tablas...");

    await connection.query("DROP TABLE IF EXISTS coments");
    await connection.query("DROP TABLE IF EXISTS rate");
    await connection.query("DROP TABLE IF EXISTS post");
    await connection.query("DROP TABLE IF EXISTS user");

    console.log("Creando tablas...");

    await connection.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                registrationCode VARCHAR(100),
                recoverPassCode VARCHAR(20),
                recoverEmailCode VARCHAR(20),
                active BOOLEAN DEFAULT false,
                createdAt TIMESTAMP NOT NULL,
                bio VARCHAR(350),
                modifiedAt TIMESTAMP
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS post (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                text VARCHAR(200) NOT NULL,
                image VARCHAR(200) NOT NULL,
                place VARCHAR(30) NOT NULL, 
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                updatedAt TIMESTAMP,
                createdAt TIMESTAMP NOT NULL
            )
        `);

    /*value VARCHAR(2) NOT NULL value>= 0 AND value<=5,*/
    await connection.query(`
            CREATE TABLE IF NOT EXISTS rate (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value ENUM ('1', '2', '3', '4', '5') NOT NULL, 
                idPost INT UNSIGNED NOT NULL,
                FOREIGN KEY (idPost) REFERENCES post(id),
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (idUser, idPost)
            )
        `);
    await connection.query(`
            CREATE TABLE IF NOT EXISTS coments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                idPost INT UNSIGNED NOT NULL,
                FOREIGN KEY (idPost) REFERENCES post(id),
                text VARCHAR(50) NOT NULL,
                updatedAt TIMESTAMP,
                createdAt TIMESTAMP NOT NULL
            )
        `);

    console.log("¡Tablas creadas!");

    const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    //Usuario administrador.
    await connection.query(
      `
                INSERT INTO user (username, email, password, role, active, createdAt)
                VALUES ('admin', 'admin@admin.com', ?, 'admin', true, ?)
            `,
      [adminPass, new Date()]
    );

    console.log("¡Usuario administrador creado!");
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) connection.release();

    process.exit();
  }
};

// Ejecutamos la función.
main();
