DROP DATABASE IF EXISTS instagram;
CREATE DATABASE IF NOT EXISTS instagram;
USE instagram;
DROP TABLE IF EXISTS coments;
DROP TABLE IF EXISTS rate;
    DROP TABLE IF EXISTS post;
    DROP TABLE IF EXISTS user;

   

    
            CREATE TABLE IF NOT EXISTS user (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                registrationCode VARCHAR(100),
                recoverPassCode VARCHAR(20),
                active BOOLEAN DEFAULT false,
                createdAt TIMESTAMP NOT NULL,
                bio VARCHAR(350),
                modifiedAt TIMESTAMP
);   
            CREATE TABLE IF NOT EXISTS post (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                text VARCHAR(200),
                image VARCHAR(20),
                place VARCHAR(30), 
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                updatedAt TIMESTAMP NOT NULL,
                createdAt TIMESTAMP NOT NULL
            );
  
            CREATE TABLE IF NOT EXISTS rate (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value VARCHAR(2) NOT NULL ,
                idPost INT UNSIGNED NOT NULL,
                FOREIGN KEY (idPost) REFERENCES post(id),
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                createdAt TIMESTAMP NOT NULL
   );
            CREATE TABLE IF NOT EXISTS coments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id),
                idPost INT UNSIGNED NOT NULL,
                FOREIGN KEY (idPost) REFERENCES post(id),
                text VARCHAR(50),
                updatedAt TIMESTAMP NOT NULL,
                createdAt TIMESTAMP NOT NULL
            );