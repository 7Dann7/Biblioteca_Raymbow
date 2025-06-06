SELECT 
  books.*, 
  autores.nombre AS autor_nombre
FROM 
  books
JOIN 
  autores ON books.autor_id = autores.id;
