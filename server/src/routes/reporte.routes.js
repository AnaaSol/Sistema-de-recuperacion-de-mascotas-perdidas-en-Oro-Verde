const express = require('express');
const router = express.Router();
const {
  reportarMascotaPerdida,
  reportarMascotaEncontrada,
  obtenerReportesActivos,
  obtenerUbicacionMascota
} = require('../controllers/reporte.controller');
const { proteger, autorizarRoles } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/activos', obtenerReportesActivos);

// Rutas protegidas
router.post('/perdida', proteger, autorizarRoles('dueno'), reportarMascotaPerdida); // UC6 + UC22
router.post('/encontrada', proteger, autorizarRoles('dueno'), reportarMascotaEncontrada); // UC7
router.get('/mascota/:mascotaId/ubicacion', proteger, autorizarRoles('dueno'), obtenerUbicacionMascota); // UC9

module.exports = router;
