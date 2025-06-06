const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../lib/db');

// Registro - GET
router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('message') });
});

// Registro - POST
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    req.flash('message', 'Todos los campos son obligatorios');
    return res.redirect('/auth/register');
  }
  // Convertir la primera letra del usuario a minúscula
  const usernameLower = username.charAt(0).toLowerCase() + username.slice(1);
  const hash = await bcrypt.hash(password, 10);
  const userRole = role === 'Administrador' ? 'Administrador' : 'Usuario';
  connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [usernameLower, hash, userRole], (err) => {
    if (err) {
      req.flash('message', 'No se registro el usuario');
      return res.redirect('/auth/register');
    }
    req.flash('message', 'Usuario registrado correctamente');
    // Si el rol es Usuario, iniciar sesión automáticamente y redirigir a su vista
    if (userRole === 'Usuario') {
      connection.query('SELECT * FROM users WHERE username = ?', [usernameLower], (err2, results) => {
        if (!err2 && results.length) {
          req.session.userId = results[0].id;
          req.session.username = results[0].username;
          req.session.role = results[0].role;
          return res.redirect('/usuario');
        }
        res.redirect('/auth/login');
      });
    } else {
      res.redirect('/auth/login');
    }
  });
});

// Login - GET
router.get('/login', (req, res) => {
  // Si ya hay sesión activa, redirigir según rol
  if (req.session && req.session.userId && req.session.role) {
    if (req.session.role === 'Administrador') {
      return res.redirect('/home');
    } else {
      return res.redirect('/usuario');
    }
  }
  res.render('login', { message: req.flash('message') });
});

// Login - POST
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      req.flash('message', 'Usuario o contraseña incorrectos');
      return res.redirect('/auth/login');
    }
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('message', 'Usuario o contraseña incorrectos');
      return res.redirect('/auth/login');
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    // Redirección según rol
    if (user.role === 'Administrador') {
      return res.redirect('/home');
    } else {
      return res.redirect('/usuario');
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
