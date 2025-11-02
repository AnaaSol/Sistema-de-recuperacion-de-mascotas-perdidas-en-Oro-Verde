const express = require('express');
const router = express.Router();
const {
  registrarMascota,
  obtenerMascotasUsuario,
  obtenerMascotaPorId,
  modificarMascota,
  obtenerEstadoMascota
} = require('../controllers/mascota.controller');
const { proteger, autorizarRoles } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(proteger);

// Rutas de mascotas
router.post('/', autorizarRoles('dueno'), registrarMascota); // UC3
router.get('/', obtenerMascotasUsuario);
router.get('/:id', obtenerMascotaPorId);
router.put('/:id', autorizarRoles('dueno'), modificarMascota); // UC5
router.get('/:id/estado', autorizarRoles('dueno'), obtenerEstadoMascota); // UC8

module.exports = router;
