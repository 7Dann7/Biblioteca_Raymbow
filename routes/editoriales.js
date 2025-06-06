const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

// Listar todas las editoriales
router.get('/', (req, res) => {
  connection.query('SELECT * FROM editoriales ORDER BY id DESC', (err, results) => {
    if (err) return res.render('error', { error: err });
    res.render('editoriales/index', { data: results });
  });
});

// Formulario para agregar editorial
router.get('/add', (req, res) => {
  res.render('editoriales/add', { nombre: '', messages: {} });
});

// Agregar editorial
router.post('/add', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('editoriales/add', { nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('INSERT INTO editoriales (nombre) VALUES (?)', [nombre], (err) => {
    if (err) {
      return res.render('editoriales/add', { nombre, messages: { error: 'Error al agregar editorial' } });
    }
    res.redirect('/editoriales');
  });
});

// Formulario para editar editorial
router.get('/edit/:id', (req, res) => {
  connection.query('SELECT * FROM editoriales WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.redirect('/editoriales');
    res.render('editoriales/edit', { id: results[0].id, nombre: results[0].nombre, messages: {} });
  });
});

// Editar editorial
router.post('/update/:id', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('editoriales/edit', { id: req.params.id, nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('UPDATE editoriales SET nombre = ? WHERE id = ?', [nombre, req.params.id], (err) => {
    if (err) {
      return res.render('editoriales/edit', { id: req.params.id, nombre, messages: { error: 'Error al actualizar editorial' } });
    }
    res.redirect('/editoriales');
  });
});

// Eliminar editorial
router.get('/delete/:id', (req, res) => {
  connection.query('DELETE FROM editoriales WHERE id = ?', [req.params.id], (err) => {
    res.redirect('/editoriales');
  });
});

module.exports = router;
