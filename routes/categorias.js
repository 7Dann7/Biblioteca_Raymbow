const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

// Listar todas las categorías
router.get('/', (req, res) => {
  connection.query('SELECT * FROM categorias ORDER BY id DESC', (err, results) => {
    if (err) return res.render('error', { error: err });
    res.render('categorias/index', { data: results });
  });
});

// Formulario para agregar categoría
router.get('/add', (req, res) => {
  res.render('categorias/add', { nombre: '', messages: {} });
});

// Agregar categoría
router.post('/add', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('categorias/add', { nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], (err) => {
    if (err) {
      return res.render('categorias/add', { nombre, messages: { error: 'Error al agregar categoría' } });
    }
    res.redirect('/categorias');
  });
});

// Formulario para editar categoría
router.get('/edit/:id', (req, res) => {
  connection.query('SELECT * FROM categorias WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.redirect('/categorias');
    res.render('categorias/edit', { id: results[0].id, nombre: results[0].nombre, messages: {} });
  });
});

// Editar categoría
router.post('/update/:id', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('categorias/edit', { id: req.params.id, nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, req.params.id], (err) => {
    if (err) {
      return res.render('categorias/edit', { id: req.params.id, nombre, messages: { error: 'Error al actualizar categoría' } });
    }
    res.redirect('/categorias');
  });
});

// Eliminar categoría
router.get('/delete/:id', (req, res) => {
  connection.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err) => {
    res.redirect('/categorias');
  });
});

module.exports = router;
