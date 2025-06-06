CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_libro INT NOT NULL,
    fecha_prestamo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATETIME DEFAULT NULL,
    estado ENUM('activo','devuelto','vencido') DEFAULT 'activo',
    FOREIGN KEY (id_usuario) REFERENCES users(id),
    FOREIGN KEY (id_libro) REFERENCES books(id)
);
