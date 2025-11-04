// src/services/geolocalizacionService.js
const axios = require('axios');

const API_BASE_URL = process.env.GEO_API_URL || 'http://localhost:3000/api/geolocalizacion';

/**
 * Consultar ubicación a sistema de geolocalización (UC23)
 * @param {number} latitud - Coordenada de latitud
 * @param {number} longitud - Coordenada de longitud
 * @returns {Promise} Respuesta con dirección y coordenadas
 */
const consultarUbicacion = async (latitud, longitud) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/consultar`, {
      latitud,
      longitud
    });
    
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Servicio no disponible');
  }
};

/**
 * Obtener dirección a partir de coordenadas (Geocodificación inversa)
 */
const obtenerDireccion = async (latitud, longitud) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/consultar`, {
      latitud,
      longitud
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener dirección');
  }
};

/**
 * Calcular distancia entre dos puntos
 */
const calcularDistancia = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calcular-distancia`, {
      lat1,
      lon1,
      lat2,
      lon2
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Error al calcular distancia');
  }
};

const geoService = {
  consultarUbicacion,
  obtenerDireccion,
  calcularDistancia
};

module.exports = geoService;
