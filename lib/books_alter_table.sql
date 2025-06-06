-- Agregar campos editorial_id y categoria a la tabla books
ALTER TABLE books ADD COLUMN editorial_id INT, ADD COLUMN categoria VARCHAR(100);
