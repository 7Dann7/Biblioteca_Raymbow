var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
var multer = require('multer');
var path = require('path');
 
// Configuración de Multer para guardar imágenes en /public/images
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });

// display books page
router.get('/', function(req, res, next) {
    const q = req.query.q;
    let sql = 'SELECT books.*, editoriales.nombre AS editorial_nombre, autores.nombre AS autor_nombre, categorias.nombre AS categoria_nombre FROM books '
      + 'LEFT JOIN editoriales ON books.editorial_id = editoriales.id '
      + 'LEFT JOIN autores ON books.autor_id = autores.id '
      + 'LEFT JOIN categorias ON books.categoria_id = categorias.id';
    let params = [];
    if (q && q.trim() !== '') {
      sql += ' WHERE books.name LIKE ? OR autores.nombre LIKE ? OR editoriales.nombre LIKE ? OR categorias.nombre LIKE ?';
      for (let i = 0; i < 4; i++) params.push('%' + q + '%');
    }
    sql += ' ORDER BY books.id desc';
    dbConn.query(sql, params, function(err, rows) {
        if(err) {
            req.flash('error', err);
            res.render('books/index', {data: [], q});   
        } else {
            // Mostrar todos los libros si no hay búsqueda, o solo resultados si hay búsqueda
            let noResults = false;
            if (q && q.trim() !== '') {
              noResults = rows.length === 0;
            }
            res.render('books/index', {data: rows, q: q || '', noResults});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err, editoriales) {
        dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err2, autores) {
            dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err3, categorias) {
                res.render('books/add', {
                    name: '',
                    autor_id: '',
                    categoria_id: '',
                    editorial_id: '',
                    isbn: '',
                    num_paginas: '',
                    anio_publicacion: '',
                    num_ejemplares: '',
                    editoriales: editoriales || [],
                    autores: autores || [],
                    categorias: categorias || [],
                    messages: req.flash()
                });
            });
        });
    });
})

// add a new book
router.post('/add', upload.single('imagen'), function(req, res, next) {    
    let name = req.body.name;
    let autor_id = req.body.autor_id;
    let categoria_id = req.body.categoria_id;
    let editorial_id = req.body.editorial_id;
    let isbn = req.body.isbn;
    let num_paginas = req.body.num_paginas;
    let anio_publicacion = req.body.anio_publicacion;
    let num_ejemplares = req.body.num_ejemplares;
    let foto = req.file ? req.file.filename : null;
    let errors = false;

    if(name.length === 0 || !autor_id || !editorial_id || !categoria_id) {
        errors = true;
        req.flash('error', "Todos los campos son obligatorios");
        dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err, editoriales) {
            dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err2, autores) {
                dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err3, categorias) {
                    res.render('books/add', {
                        name: name,
                        autor_id: autor_id,
                        categoria_id: categoria_id,
                        editorial_id: editorial_id,
                        isbn: isbn,
                        num_paginas: num_paginas,
                        anio_publicacion: anio_publicacion,
                        num_ejemplares: num_ejemplares,
                        editoriales: editoriales || [],
                        autores: autores || [],
                        categorias: categorias || [],
                        messages: req.flash()
                    });
                });
            });
        });
    }

    if(!errors) {
        var form_data = {
            name: name,
            autor_id: autor_id,
            categoria_id: categoria_id,
            editorial_id: editorial_id,
            isbn: isbn,
            num_paginas: num_paginas,
            anio_publicacion: anio_publicacion,
            num_ejemplares: num_ejemplares,
            foto: foto
        }
        dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err2, editoriales) {
                    dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err3, autores) {
                        dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err4, categorias) {
                            res.render('books/add', {
                                name: form_data.name,
                                autor_id: form_data.autor_id,
                                categoria_id: form_data.categoria_id,
                                editorial_id: form_data.editorial_id,
                                isbn: form_data.isbn,
                                num_paginas: form_data.num_paginas,
                                anio_publicacion: form_data.anio_publicacion,
                                num_ejemplares: form_data.num_ejemplares,
                                editoriales: editoriales || [],
                                autores: autores || [],
                                categorias: categorias || [],
                                messages: req.flash()
                            });
                        });
                    });
                });
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books')
        } else {
            dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err2, editoriales) {
                dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err3, autores) {
                    dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err4, categorias) {
                        res.render('books/edit', {
                            title: 'Edit Book', 
                            id: rows[0].id,
                            name: rows[0].name,
                            autor_id: rows[0].autor_id || '',
                            categoria_id: rows[0].categoria_id || '',
                            editorial_id: rows[0].editorial_id || '',
                            isbn: rows[0].isbn || '',
                            num_paginas: rows[0].num_paginas || '',
                            anio_publicacion: rows[0].anio_publicacion || '',
                            num_ejemplares: rows[0].num_ejemplares || '',
                            editoriales: editoriales || [],
                            autores: autores || [],
                            categorias: categorias || [],
                            messages: req.flash()
                        })
                    });
                });
            });
        }
    })
})

// update book data
router.post('/update/:id', upload.single('imagen'), function(req, res, next) {
    let id = req.params.id;
    let name = req.body.name;
    let autor_id = req.body.autor_id;
    let categoria_id = req.body.categoria_id;
    let editorial_id = req.body.editorial_id;
    let isbn = req.body.isbn;
    let num_paginas = req.body.num_paginas;
    let anio_publicacion = req.body.anio_publicacion;
    let num_ejemplares = req.body.num_ejemplares;
    let errors = false;

    if(name.length === 0 || !autor_id || !editorial_id || !categoria_id) {
        errors = true;
        req.flash('error', "Todos los campos son obligatorios");
        dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err, editoriales) {
            dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err2, autores) {
                dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err3, categorias) {
                    dbConn.query('SELECT * FROM books WHERE id = ?', [id], function(err4, rows) {
                        res.render('books/edit', {
                            id: id,
                            name: name,
                            autor_id: autor_id,
                            categoria_id: categoria_id,
                            editorial_id: editorial_id,
                            isbn: isbn,
                            num_paginas: num_paginas,
                            anio_publicacion: anio_publicacion,
                            num_ejemplares: num_ejemplares,
                            foto: rows && rows[0] ? rows[0].foto : '',
                            editoriales: editoriales || [],
                            autores: autores || [],
                            categorias: categorias || [],
                            messages: req.flash()
                        });
                    });
                });
            });
        });
    }
    if( !errors ) {   
        var form_data = {
            name: name,
            autor_id: autor_id,
            categoria_id: categoria_id,
            editorial_id: editorial_id,
            isbn: isbn,
            num_paginas: num_paginas,
            anio_publicacion: anio_publicacion,
            num_ejemplares: num_ejemplares
        };
        if (req.file) {
            form_data.foto = req.file.filename;
        }
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                dbConn.query('SELECT * FROM editoriales ORDER BY nombre', function(err2, editoriales) {
                    dbConn.query('SELECT * FROM autores ORDER BY nombre', function(err3, autores) {
                        dbConn.query('SELECT * FROM categorias ORDER BY nombre', function(err4, categorias) {
                            dbConn.query('SELECT * FROM books WHERE id = ?', [id], function(err5, rows) {
                                res.render('books/edit', {
                                    id: id,
                                    name: form_data.name,
                                    autor_id: form_data.autor_id,
                                    categoria_id: form_data.categoria_id,
                                    editorial_id: form_data.editorial_id,
                                    isbn: form_data.isbn,
                                    num_paginas: form_data.num_paginas,
                                    anio_publicacion: form_data.anio_publicacion,
                                    num_ejemplares: form_data.num_ejemplares,
                                    foto: rows && rows[0] ? rows[0].foto : '',
                                    editoriales: editoriales || [],
                                    autores: autores || [],
                                    categorias: categorias || [],
                                    messages: req.flash()
                                });
                            });
                        });
                    });
                });
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

// Desactivar (backup) libro
router.post('/backup/:id', function(req, res) {
  const id = req.params.id;
  // Obtener el libro a desactivar
  dbConn.query('SELECT * FROM books WHERE id = ?', [id], function(err, results) {
    if (err || !results.length) {
      req.flash('error', 'Libro no encontrado');
      return res.redirect('/books');
    }
    const libro = results[0];
    // Insertar en tabla backup_books (crear si no existe)
    dbConn.query(`CREATE TABLE IF NOT EXISTS backup_books LIKE books`, function(err2) {
      if (err2) {
        req.flash('error', 'Error al crear tabla backup');
        return res.redirect('/books');
      }
      dbConn.query('INSERT INTO backup_books SELECT * FROM books WHERE id = ?', [id], function(err3) {
        if (err3) {
          req.flash('error', 'Error al respaldar libro');
          return res.redirect('/books');
        }
        // Eliminar de la tabla principal
        dbConn.query('DELETE FROM books WHERE id = ?', [id], function(err4) {
          if (err4) {
            req.flash('error', 'Error al eliminar libro');
            return res.redirect('/books');
          }
          req.flash('success', 'Libro desactivado y respaldado correctamente');
          res.redirect('/books');
        });
      });
    });
  });
});

// Mostrar libros en backup
router.get('/backup', function(req, res) {
  dbConn.query('CREATE TABLE IF NOT EXISTS backup_books LIKE books', function(err) {
    if (err) return res.render('books/backup', { data: [], error: 'Error al crear tabla backup' });
    dbConn.query('SELECT * FROM backup_books', function(err2, rows) {
      if (err2) return res.render('books/backup', { data: [], error: 'Error al consultar backup' });
      res.render('books/backup', { data: rows, error: null });
    });
  });
});

// Restaurar libro desde backup
router.post('/backup/restore/:id', function(req, res) {
  const id = req.params.id;
  dbConn.query('SELECT * FROM backup_books WHERE id = ?', [id], function(err, results) {
    if (err || !results.length) return res.redirect('/books/backup');
    dbConn.query('INSERT INTO books SELECT * FROM backup_books WHERE id = ?', [id], function(err2) {
      if (err2) return res.redirect('/books/backup');
      dbConn.query('DELETE FROM backup_books WHERE id = ?', [id], function() {
        res.redirect('/books/backup');
      });
    });
  });
});

module.exports = router;