var express = require('express');
var router = express.Router();

// Vista principal para usuario
router.get('/', function(req, res) {
  res.render('indexUsuario');
});

module.exports = router;
