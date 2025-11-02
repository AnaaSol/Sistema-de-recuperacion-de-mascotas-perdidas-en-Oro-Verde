const express = require('express');
const router = express.Router();
const {
  consultarUbicacion,
  obtenerDireccionDeUbicacion,
  geocodificarDireccion,
  calcularDistancia,
  buscarMascotasCercanas,
  verificarEstado
} = require('../controllers/geolocalizacion.controller');

// Rutas públicas
router.post('/consultar', consultarUbicacion); // UC23 - Consultar ubicación a sistema de geolocalización
router.get('/ubicacion/:ubicacionId', obtenerDireccionDeUbicacion);
router.post('/geocodificar', geocodificarDireccion);
router.post('/calcular-distancia', calcularDistancia);
router.post('/mascotas-cercanas', buscarMascotasCercanas);
router.get('/estado', verificarEstado);

module.exports = router;
