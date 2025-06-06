const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

// Middleware para requerir login (ajusta según tu sistema de auth)
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Middleware para requerir rol administrador
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== 'Administrador') {
    return res.status(403).send('No autorizado');
  }
  next();
}

// Solicitar préstamo (usuario)
router.post('/solicitar', requireLogin, (req, res) => {
  const { id_libro } = req.body;
  const id_usuario = req.session.userId;
  // Verificar ejemplares disponibles
  connection.query('SELECT num_ejemplares FROM books WHERE id = ?', [id_libro], (err, results) => {
    if (err) return res.status(500).send('Error en la base de datos');
    if (!results.length || results[0].num_ejemplares < 1) {
      return res.status(400).send('No hay ejemplares disponibles');
    }
    // Crear préstamo
    connection.query('INSERT INTO prestamos (id_usuario, id_libro) VALUES (?, ?)', [id_usuario, id_libro], (err2) => {
      if (err2) return res.status(500).send('Error al registrar el préstamo');
      // Descontar ejemplar
      connection.query('UPDATE books SET num_ejemplares = num_ejemplares - 1 WHERE id = ?', [id_libro]);
      res.redirect('/usuario');
    });
  });
});

// Panel de administración de préstamos con filtro por estado
router.get('/admin', requireLogin, requireAdmin, (req, res) => {
  const estado = req.query.estado;
  let sql = `SELECT p.*, u.username, b.name as libro FROM prestamos p
    JOIN users u ON p.id_usuario = u.id
    JOIN books b ON p.id_libro = b.id`;
  const params = [];
  if (estado && ['activo', 'devuelto', 'vencido'].includes(estado)) {
    sql += ' WHERE p.estado = ?';
    params.push(estado);
  }
  sql += ' ORDER BY p.fecha_prestamo DESC';
  connection.query(sql, params, (err, prestamos) => {
    if (err) return res.status(500).send('Error en la base de datos');
    res.render('prestamos/admin', { prestamos, estado });
  });
});

// Devolver libro (admin o usuario)
router.post('/devolver/:id', requireLogin, (req, res) => {
  const id_prestamo = req.params.id;
  // Buscar préstamo
  connection.query('SELECT * FROM prestamos WHERE id = ?', [id_prestamo], (err, results) => {
    if (err || !results.length) return res.status(404).send('Préstamo no encontrado');
    const prestamo = results[0];
    // Solo admin o dueño del préstamo
    if ((req.session.role !== 'admin' && req.session.role !== 'Administrador') && req.session.userId !== prestamo.id_usuario) {
      return res.status(403).send('No autorizado');
    }
    // Actualizar préstamo y sumar ejemplar
    connection.query('UPDATE prestamos SET estado = "devuelto", fecha_devolucion = NOW() WHERE id = ?', [id_prestamo], (err2) => {
      if (err2) return res.status(500).send('Error al devolver');
      connection.query('UPDATE books SET num_ejemplares = num_ejemplares + 1 WHERE id = ?', [prestamo.id_libro]);
      // Redirección correcta según rol
      if (req.session.role === 'admin' || req.session.role === 'Administrador') {
        res.redirect('/prestamos/admin');
      } else {
        res.redirect('/usuario');
      }
    });
  });
});

module.exports = router;
