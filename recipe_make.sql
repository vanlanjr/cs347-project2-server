DROP DATABASE IF EXISTS cookbook;
DROP USER IF EXISTS cookbook_user@localhost;

CREATE DATABASE cookbook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER cookbook_user@localhost IDENTIFIED BY 'Gr8d@ytoc0de!';
GRANT ALL PRIVILEGES ON cookbook.* TO cookbook_user@localhost;
