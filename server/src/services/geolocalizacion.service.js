const axios = require('axios');

/**
 * Servicio de Geolocalización
 * Integración con APIs externas de geolocalización (Google Maps, OpenStreetMap, etc.)
 */

class GeolocalizacionService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.disponible = true;
  }

  /**
   * Obtener dirección a partir de coordenadas (Geocodificación Inversa)
   * @param {number} latitud
   * @param {number} longitud
   * @returns {Promise<Object>}
   */
  async obtenerDireccionPorCoordenadas(latitud, longitud) {
    try {
      // Si no hay API key, usar servicio alternativo (Nominatim de OpenStreetMap)
      if (!this.googleMapsApiKey) {
        return await this.obtenerDireccionConNominatim(latitud, longitud);
      }

      // Usar Google Maps Geocoding API
      const url = `https://maps.googleapis.com/maps/api/geocode/json`;
      const response = await axios.get(url, {
        params: {
          latlng: `${latitud},${longitud}`,
          key: this.googleMapsApiKey,
          language: 'es'
        },
        timeout: 5000
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          success: true,
          direccionCompleta: result.formatted_address,
          componentes: this.extraerComponentesDireccion(result.address_components),
          latitud,
          longitud,
          proveedor: 'Google Maps'
        };
      }

      throw new Error('No se pudo obtener la dirección');
    } catch (error) {
      console.error('Error al consultar geolocalización:', error.message);

      // Fallback a servicio alternativo
      if (error.code === 'ECONNREFUSED' || error.response?.status === 401) {
        return await this.obtenerDireccionConNominatim(latitud, longitud);
      }

      return {
        success: false,
        error: error.message,
        direccionCompleta: `Lat: ${latitud}, Lng: ${longitud}`,
        latitud,
        longitud,
        proveedor: 'Ninguno (Offline)'
      };
    }
  }

  /**
   * Obtener dirección usando Nominatim (OpenStreetMap) - Servicio gratuito
   * @param {number} latitud
   * @param {number} longitud
   * @returns {Promise<Object>}
   */
  async obtenerDireccionConNominatim(latitud, longitud) {
    try {
      const url = 'https://nominatim.openstreetmap.org/reverse';
      const response = await axios.get(url, {
        params: {
          lat: latitud,
          lon: longitud,
          format: 'json',
          'accept-language': 'es'
        },
        headers: {
          'User-Agent': 'SistemaRecuperacionMascotas/1.0'
        },
        timeout: 5000
      });

      if (response.data && response.data.display_name) {
        return {
          success: true,
          direccionCompleta: response.data.display_name,
          componentes: {
            calle: response.data.address?.road || '',
            numero: response.data.address?.house_number || '',
            barrio: response.data.address?.suburb || response.data.address?.neighbourhood || '',
            ciudad: response.data.address?.city || response.data.address?.town || 'Oro Verde',
            provincia: response.data.address?.state || 'Entre Ríos',
            pais: response.data.address?.country || 'Argentina',
            codigoPostal: response.data.address?.postcode || ''
          },
          latitud,
          longitud,
          proveedor: 'OpenStreetMap Nominatim'
        };
      }

      throw new Error('No se pudo obtener la dirección');
    } catch (error) {
      console.error('Error al consultar Nominatim:', error.message);
      return {
        success: false,
        error: error.message,
        direccionCompleta: `Lat: ${latitud}, Lng: ${longitud}`,
        latitud,
        longitud,
        proveedor: 'Ninguno (Offline)'
      };
    }
  }

  /**
   * Obtener coordenadas a partir de una dirección (Geocodificación)
   * @param {string} direccion
   * @returns {Promise<Object>}
   */
  async obtenerCoordenadasPorDireccion(direccion) {
    try {
      if (!this.googleMapsApiKey) {
        return await this.obtenerCoordenadasConNominatim(direccion);
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json`;
      const response = await axios.get(url, {
        params: {
          address: direccion,
          key: this.googleMapsApiKey,
          language: 'es'
        },
        timeout: 5000
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          success: true,
          latitud: result.geometry.location.lat,
          longitud: result.geometry.location.lng,
          direccionCompleta: result.formatted_address,
          proveedor: 'Google Maps'
        };
      }

      throw new Error('No se pudo obtener las coordenadas');
    } catch (error) {
      console.error('Error al geocodificar dirección:', error.message);
      return await this.obtenerCoordenadasConNominatim(direccion);
    }
  }

  /**
   * Obtener coordenadas usando Nominatim
   * @param {string} direccion
   * @returns {Promise<Object>}
   */
  async obtenerCoordenadasConNominatim(direccion) {
    try {
      const url = 'https://nominatim.openstreetmap.org/search';
      const response = await axios.get(url, {
        params: {
          q: direccion,
          format: 'json',
          limit: 1,
          'accept-language': 'es'
        },
        headers: {
          'User-Agent': 'SistemaRecuperacionMascotas/1.0'
        },
        timeout: 5000
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          success: true,
          latitud: parseFloat(result.lat),
          longitud: parseFloat(result.lon),
          direccionCompleta: result.display_name,
          proveedor: 'OpenStreetMap Nominatim'
        };
      }

      throw new Error('No se pudo obtener las coordenadas');
    } catch (error) {
      console.error('Error al geocodificar con Nominatim:', error.message);
      return {
        success: false,
        error: error.message,
        proveedor: 'Ninguno (Offline)'
      };
    }
  }

  /**
   * Calcular distancia entre dos puntos (en metros)
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} Distancia en metros
   */
  calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Extraer componentes de dirección de Google Maps
   * @param {Array} addressComponents
   * @returns {Object}
   */
  extraerComponentesDireccion(addressComponents) {
    const componentes = {};

    addressComponents.forEach(component => {
      if (component.types.includes('street_number')) {
        componentes.numero = component.long_name;
      }
      if (component.types.includes('route')) {
        componentes.calle = component.long_name;
      }
      if (component.types.includes('neighborhood') || component.types.includes('sublocality')) {
        componentes.barrio = component.long_name;
      }
      if (component.types.includes('locality')) {
        componentes.ciudad = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        componentes.provincia = component.long_name;
      }
      if (component.types.includes('country')) {
        componentes.pais = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        componentes.codigoPostal = component.long_name;
      }
    });

    return componentes;
  }

  /**
   * Verificar disponibilidad del servicio
   * @returns {Promise<Object>}
   */
  async verificarDisponibilidad() {
    try {
      // Probar con coordenadas de Oro Verde
      const resultado = await this.obtenerDireccionPorCoordenadas(-31.7833, -60.5167);
      this.disponible = resultado.success;
      return {
        disponible: this.disponible,
        proveedor: resultado.proveedor,
        mensaje: resultado.success ? 'Servicio de geolocalización disponible' : 'Servicio no disponible'
      };
    } catch (error) {
      this.disponible = false;
      return {
        disponible: false,
        mensaje: 'Error al verificar disponibilidad',
        error: error.message
      };
    }
  }
}

module.exports = new GeolocalizacionService();
