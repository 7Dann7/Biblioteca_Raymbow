const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

// GET home page
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  // Consultar el usuario logueado por ID
  connection.query('SELECT * FROM users WHERE id = ?', [req.session.userId], (err, results) => {
    if (err || !results.length) {
      return res.redirect('/auth/login');
    }
    const user = results[0];
    res.render('indexHome', {
      title: 'Panel de administrador',
      user: user
    });
  });
});

module.exports = router;

