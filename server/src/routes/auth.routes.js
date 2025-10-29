const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  iniciarSesion,
  obtenerUsuarioActual,
  modificarPerfil
} = require('../controllers/auth.controller');
const { proteger } = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas protegidas
router.get('/me', proteger, obtenerUsuarioActual);
router.put('/perfil', proteger, modificarPerfil);

module.exports = router;
