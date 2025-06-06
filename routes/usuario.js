var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
const fetch = require('node-fetch');

// Vista principal para usuario
router.get('/', function(req, res) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  dbConn.query('SELECT * FROM books WHERE num_ejemplares > 0 ORDER BY id DESC', function(err, rows) {
    if (err) {
      return res.render('indexUsuario', { data: [], user: null, googleBooks: null, q: '' });
    }
    dbConn.query('SELECT * FROM users WHERE id = ?', [req.session.userId], function(err2, results) {
      const user = (!err2 && results.length) ? results[0] : null;
      res.render('indexUsuario', { data: rows, user, googleBooks: null, q: '' });
    });
  });
});

// Búsqueda Google Books
router.get('/buscar-google', async function(req, res) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  const q = req.query.q || '';
  let googleBooks = [];
  if (q) {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&langRestrict=es`);
      const data = await response.json();
      googleBooks = data.items || [];
    } catch (e) {
      googleBooks = [];
    }
  }
  dbConn.query('SELECT * FROM books WHERE num_ejemplares > 0 ORDER BY id DESC', function(err, rows) {
    dbConn.query('SELECT * FROM users WHERE id = ?', [req.session.userId], function(err2, results) {
      const user = (!err2 && results.length) ? results[0] : null;
      res.render('indexUsuario', { data: rows, user, googleBooks, q });
    });
  });
});

// Agregar libro desde Google Books
router.post('/agregar-google', async function(req, res) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  const { title, author, editorial, categoria, isbn, anio, num_paginas, num_ejemplares } = req.body;
  // Validar duplicados por ISBN o (título+autor)
  let findBookQuery = 'SELECT * FROM books WHERE ';
  let findBookParams = [];
  if (isbn && isbn.trim() !== '') {
    findBookQuery += 'isbn = ?';
    findBookParams.push(isbn);
  } else {
    findBookQuery += 'name = ? AND autor_nombre = ?';
    findBookParams.push(title, author);
  }
  dbConn.query(findBookQuery, findBookParams, function(err, books) {
    if (err) {
      req.flash('error', 'Error al buscar libro.');
      return res.redirect('/usuario');
    }
    let bookId;
    if (books && books.length > 0) {
      // El libro ya existe
      bookId = books[0].id;
      // Registrar préstamo directamente
      dbConn.query('INSERT INTO prestamos (user_id, book_id, fecha_prestamo, estado) VALUES (?, ?, NOW(), ?)', [req.session.userId, bookId, 'prestado'], function(err2) {
        if (err2) {
          req.flash('error', 'Error al registrar el préstamo.');
        } else {
          req.flash('success', '¡Libro prestado exitosamente!');
        }
        return res.redirect('/usuario');
      });
    } else {
      // Insertar libro y luego registrar préstamo
      dbConn.query(
        'INSERT INTO books (name, autor_nombre, editorial_nombre, categoria_nombre, isbn, anio_publicacion, num_paginas, num_ejemplares) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, author, editorial, categoria, isbn, anio, num_paginas || 1, num_ejemplares || 1],
        function(err3, result) {
          if (err3) {
            console.error('Error MySQL al agregar libro:', err3); // <-- Mostrar error real en consola
            req.flash('error', 'Error al agregar libro.');
            return res.redirect('/usuario');
          }
          bookId = result.insertId;
          dbConn.query('INSERT INTO prestamos (user_id, book_id, fecha_prestamo, estado) VALUES (?, ?, NOW(), ?)', [req.session.userId, bookId, 'prestado'], function(err4) {
            if (err4) {
              req.flash('error', 'Error al registrar el préstamo.');
            } else {
              req.flash('success', '¡Libro agregado y prestado exitosamente!');
            }
            return res.redirect('/usuario');
          });
        }
      );
    }
  });
});

router.get('/usuario', function(req, res) {
  dbConn.query(
    'SELECT books.*, autores.nombre AS autor_nombre FROM books JOIN autores ON books.autor_id = autores.id',
    function(err, results) {
      if (err) {
        // Manejo de error
        return res.status(500).send('Error en la base de datos');
      }
      res.render('indexUsuario', { data: results });
    }
  );
});

module.exports = router;
