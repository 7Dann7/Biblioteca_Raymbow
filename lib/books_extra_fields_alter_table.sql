-- Agregar campos ISBN, número de páginas y año de publicación a la tabla books
ALTER TABLE books 
  ADD COLUMN isbn VARCHAR(30),
  ADD COLUMN num_paginas INT,
  ADD COLUMN anio_publicacion INT;
