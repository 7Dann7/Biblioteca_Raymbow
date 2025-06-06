-- Script para crear un usuario administrador manualmente en la tabla users
-- Cambia la contraseña por la que desees, recuerda que debe estar hasheada con bcrypt si tu app lo requiere

INSERT INTO users (username, password, role) VALUES (
  'Mattias',
  'admin', -- Contraseña: admin123 (hash de ejemplo)
  'Administrador'
);

-- Puedes generar un hash bcrypt real con Node.js o un generador online para mayor seguridad.
