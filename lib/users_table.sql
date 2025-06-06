-- Tabla de usuarios para autenticación con roles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Usuario','Administrador') NOT NULL DEFAULT 'Usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Si la tabla ya existe y quieres agregar el campo role:
-- ALTER TABLE users ADD COLUMN role ENUM('Usuario','Administrador') NOT NULL DEFAULT 'Usuario';
