const geolocalizacionService = require('../services/geolocalizacion.service');
const { Ubicacion, ReporteMascota, Mascota } = require('../models');

// @desc    Consultar ubicación a sistema de geolocalización (UC23)
// @route   POST /api/geolocalizacion/consultar
// @access  Public
exports.consultarUbicacion = async (req, res) => {
  try {
    const { latitud, longitud } = req.body;

    // Validar coordenadas
    if (!latitud || !longitud) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son obligatorias'
      });
    }

    if (latitud < -90 || latitud > 90) {
      return res.status(400).json({
        success: false,
        message: 'Latitud inválida (debe estar entre -90 y 90)'
      });
    }

    if (longitud < -180 || longitud > 180) {
      return res.status(400).json({
        success: false,
        message: 'Longitud inválida (debe estar entre -180 y 180)'
      });
    }

    // Consultar servicio de geolocalización externo
    const resultado = await geolocalizacionService.obtenerDireccionPorCoordenadas(
      parseFloat(latitud),
      parseFloat(longitud)
    );

    res.status(200).json({
      success: true,
      message: 'Ubicación consultada exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error al consultar ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar sistema de geolocalización',
      error: error.message
    });
  }
};

// @desc    Obtener dirección de una ubicación almacenada
// @route   GET /api/geolocalizacion/ubicacion/:ubicacionId
// @access  Public
exports.obtenerDireccionDeUbicacion = async (req, res) => {
  try {
    const { ubicacionId } = req.params;

    const ubicacion = await Ubicacion.findByPk(ubicacionId);

    if (!ubicacion) {
      return res.status(404).json({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }

    // Consultar dirección si no está almacenada
    let direccionCompleta = ubicacion.descripcionLugar;

    if (!direccionCompleta || direccionCompleta.includes('Lat:')) {
      const resultado = await geolocalizacionService.obtenerDireccionPorCoordenadas(
        parseFloat(ubicacion.latitud),
        parseFloat(ubicacion.longitud)
      );

      if (resultado.success) {
        direccionCompleta = resultado.direccionCompleta;

        // Actualizar ubicación con la dirección obtenida
        await ubicacion.update({
          descripcionLugar: direccionCompleta
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: ubicacion.id,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        descripcionLugar: direccionCompleta,
        precisionMetros: ubicacion.precisionMetros
      }
    });
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener dirección',
      error: error.message
    });
  }
};

// @desc    Geocodificar dirección (obtener coordenadas)
// @route   POST /api/geolocalizacion/geocodificar
// @access  Public
exports.geocodificarDireccion = async (req, res) => {
  try {
    const { direccion } = req.body;

    if (!direccion) {
      return res.status(400).json({
        success: false,
        message: 'La dirección es obligatoria'
      });
    }

    const resultado = await geolocalizacionService.obtenerCoordenadasPorDireccion(direccion);

    res.status(200).json({
      success: resultado.success,
      message: resultado.success ? 'Dirección geocodificada exitosamente' : 'No se pudo geocodificar la dirección',
      data: resultado
    });
  } catch (error) {
    console.error('Error al geocodificar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al geocodificar dirección',
      error: error.message
    });
  }
};

// @desc    Calcular distancia entre dos ubicaciones
// @route   POST /api/geolocalizacion/calcular-distancia
// @access  Public
exports.calcularDistancia = async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.body;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren ambas coordenadas (lat1, lon1, lat2, lon2)'
      });
    }

    const distancia = geolocalizacionService.calcularDistancia(
      parseFloat(lat1),
      parseFloat(lon1),
      parseFloat(lat2),
      parseFloat(lon2)
    );

    res.status(200).json({
      success: true,
      data: {
        distanciaMetros: Math.round(distancia),
        distanciaKilometros: (distancia / 1000).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error al calcular distancia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular distancia',
      error: error.message
    });
  }
};

// @desc    Buscar mascotas perdidas cerca de una ubicación
// @route   POST /api/geolocalizacion/mascotas-cercanas
// @access  Public
exports.buscarMascotasCercanas = async (req, res) => {
  try {
    const { latitud, longitud, radioKm = 5 } = req.body;

    if (!latitud || !longitud) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son obligatorias'
      });
    }

    // Obtener todos los reportes activos con ubicación
    const reportesActivos = await ReporteMascota.findAll({
      where: { estadoReporte: 'activo' },
      include: [
        {
          model: Ubicacion,
          as: 'ubicacion',
          required: true
        },
        {
          model: Mascota,
          as: 'mascota',
          required: true
        }
      ]
    });

    // Filtrar por distancia
    const mascotasCercanas = reportesActivos
      .map(reporte => {
        const distancia = geolocalizacionService.calcularDistancia(
          parseFloat(latitud),
          parseFloat(longitud),
          parseFloat(reporte.ubicacion.latitud),
          parseFloat(reporte.ubicacion.longitud)
        );

        return {
          reporte,
          distanciaMetros: Math.round(distancia),
          distanciaKilometros: (distancia / 1000).toFixed(2)
        };
      })
      .filter(item => item.distanciaMetros <= (radioKm * 1000))
      .sort((a, b) => a.distanciaMetros - b.distanciaMetros);

    res.status(200).json({
      success: true,
      data: {
        ubicacionBusqueda: {
          latitud,
          longitud,
          radioKm
        },
        totalEncontradas: mascotasCercanas.length,
        mascotas: mascotasCercanas.map(item => ({
          id: item.reporte.id,
          mascota: {
            id: item.reporte.mascota.id,
            nombre: item.reporte.mascota.nombre,
            raza: item.reporte.mascota.raza,
            especie: item.reporte.mascota.especie,
            colores: item.reporte.mascota.colores,
            tamano: item.reporte.mascota.tamano,
            fotoUrl: item.reporte.mascota.fotoUrl
          },
          ubicacion: {
            latitud: item.reporte.ubicacion.latitud,
            longitud: item.reporte.ubicacion.longitud,
            descripcion: item.reporte.ubicacion.descripcionLugar
          },
          distancia: {
            metros: item.distanciaMetros,
            kilometros: item.distanciaKilometros
          },
          descripcion: item.reporte.descripcion,
          fechaReporte: item.reporte.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error al buscar mascotas cercanas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar mascotas cercanas',
      error: error.message
    });
  }
};

// @desc    Verificar disponibilidad del servicio de geolocalización
// @route   GET /api/geolocalizacion/estado
// @access  Public
exports.verificarEstado = async (req, res) => {
  try {
    const estado = await geolocalizacionService.verificarDisponibilidad();

    res.status(200).json({
      success: true,
      data: estado
    });
  } catch (error) {
    console.error('Error al verificar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar estado del servicio',
      error: error.message
    });
  }
};

module.exports = exports;
