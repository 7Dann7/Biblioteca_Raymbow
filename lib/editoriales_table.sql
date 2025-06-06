-- Tabla de editoriales para el CRUD de Editoriales
CREATE TABLE IF NOT EXISTS editoriales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
