DROP DATABASE if exists diva_db;
CREATE DATABASE diva_db;

DROP USER IF EXISTS 'diva_user';
CREATE USER 'diva_user'@'%' IDENTIFIED BY 'diva1234' PASSWORD EXPIRE NEVER;
GRANT ALL PRIVILEGES ON *.* TO 'diva_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';

flush privileges;

use diva_db;

SET FOREIGN_KEY_CHECKS=0;