const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

// Listar todos los autores
router.get('/', (req, res) => {
  connection.query('SELECT * FROM autores ORDER BY id DESC', (err, results) => {
    if (err) return res.render('error', { error: err });
    res.render('autores/index', { data: results });
  });
});

// Formulario para agregar autor
router.get('/add', (req, res) => {
  res.render('autores/add', { nombre: '', messages: {} });
});

// Agregar autor
router.post('/add', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('autores/add', { nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('INSERT INTO autores (nombre) VALUES (?)', [nombre], (err) => {
    if (err) {
      return res.render('autores/add', { nombre, messages: { error: 'Error al agregar autor' } });
    }
    res.redirect('/autores');
  });
});

// Formulario para editar autor
router.get('/edit/:id', (req, res) => {
  connection.query('SELECT * FROM autores WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.redirect('/autores');
    res.render('autores/edit', { id: results[0].id, nombre: results[0].nombre, messages: {} });
  });
});

// Editar autor
router.post('/update/:id', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('autores/edit', { id: req.params.id, nombre, messages: { error: 'El nombre es obligatorio' } });
  }
  connection.query('UPDATE autores SET nombre = ? WHERE id = ?', [nombre, req.params.id], (err) => {
    if (err) {
      return res.render('autores/edit', { id: req.params.id, nombre, messages: { error: 'Error al actualizar autor' } });
    }
    res.redirect('/autores');
  });
});

// Eliminar autor
router.get('/delete/:id', (req, res) => {
  connection.query('DELETE FROM autores WHERE id = ?', [req.params.id], (err) => {
    res.redirect('/autores');
  });
});

module.exports = router;
