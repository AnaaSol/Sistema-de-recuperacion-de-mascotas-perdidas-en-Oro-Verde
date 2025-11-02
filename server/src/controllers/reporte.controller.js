const { ReporteMascota, Mascota, Ubicacion, EstadoMascota, Alerta, Notificacion, User } = require('../models');

// @desc    Reportar mascota como perdida (UC6) + Generar alerta (UC22)
// @route   POST /api/reportes/perdida
// @access  Private (solo dueños)
exports.reportarMascotaPerdida = async (req, res) => {
  try {
    const { mascotaId, latitud, longitud, descripcionLugar, descripcion } = req.body;

    // Validar campos obligatorios
    if (!mascotaId || !latitud || !longitud || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos obligatorios (mascotaId, latitud, longitud, descripcion)'
      });
    }

    // Verificar que la mascota existe y pertenece al usuario
    const mascota = await Mascota.findByPk(mascotaId, {
      include: [
        {
          model: User,
          as: 'dueno',
          attributes: ['id', 'nombre', 'apellido', 'celular', 'email']
        }
      ]
    });

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    if (mascota.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para reportar esta mascota'
      });
    }

    // Verificar el estado actual de la mascota
    const estadoActual = await EstadoMascota.findOne({
      where: { mascotaId },
      order: [['createdAt', 'DESC']]
    });

    if (estadoActual && estadoActual.estado === 'perdida') {
      return res.status(400).json({
        success: false,
        message: 'La mascota ya se encuentra reportada como perdida'
      });
    }

    // Crear ubicación
    const ubicacion = await Ubicacion.create({
      latitud,
      longitud,
      descripcionLugar,
      precisionMetros: 50
    });

    // Crear reporte
    const reporte = await ReporteMascota.create({
      mascotaId,
      usuarioId: req.usuario.id,
      tipoReporte: 'perdida',
      estadoReporte: 'activo',
      ubicacionId: ubicacion.id,
      descripcion,
      coincidenciasEncontradas: 0
    });

    // Actualizar estado de la mascota
    await EstadoMascota.create({
      mascotaId,
      estado: 'perdida',
      razonCambio: 'Reportado como perdido'
    });

    // === UC22: GENERAR ALERTA AUTOMÁTICA ===
    const mensajeAlerta = `⚠️ MASCOTA PERDIDA: ${mascota.nombre} (${mascota.raza} - ${mascota.especie})
📍 Ubicación: ${descripcionLugar || 'Lat: ' + latitud + ', Lng: ' + longitud}
🎨 Colores: ${mascota.colores}
📏 Tamaño: ${mascota.tamano}
📞 Contacto: ${mascota.dueno.celular}
📧 Email: ${mascota.dueno.email}
📝 ${descripcion}`;

    const alerta = await Alerta.create({
      reporteId: reporte.id,
      descripcionMensaje: mensajeAlerta,
      enviado: false,
      tipoAlerta: 'mascota_perdida'
    });

    // Obtener todos los vecinos de la zona para notificar
    // TODO: Implementar lógica de geolocalización para vecinos cercanos
    const vecinos = await User.findAll({
      where: { rol: 'vecino', activo: true },
      limit: 10 // Limitar por ahora
    });

    // Crear notificaciones para vecinos
    const notificaciones = await Promise.all(
      vecinos.map(vecino =>
        Notificacion.create({
          usuarioId: vecino.id,
          alertaId: alerta.id,
          canal: 'email',
          contenido: `Hola ${vecino.nombre}, se ha reportado una mascota perdida cerca de tu zona: ${mascota.nombre}. ${mensajeAlerta}`,
          estado: 'pendiente',
          reintentos: 0
        })
      )
    );

    // Marcar alerta como enviada
    await alerta.update({ enviado: true });

    // Cargar el reporte completo con todas las relaciones
    const reporteCompleto = await ReporteMascota.findByPk(reporte.id, {
      include: [
        {
          model: Mascota,
          as: 'mascota',
          include: [
            {
              model: User,
              as: 'dueno',
              attributes: ['id', 'nombre', 'apellido', 'celular', 'email']
            }
          ]
        },
        {
          model: Ubicacion,
          as: 'ubicacion'
        },
        {
          model: Alerta,
          as: 'alertas'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Mascota reportada como perdida y alerta generada exitosamente',
      data: {
        reporte: reporteCompleto,
        alerta: {
          id: alerta.id,
          mensaje: alerta.descripcionMensaje,
          notificacionesEnviadas: notificaciones.length
        }
      }
    });
  } catch (error) {
    console.error('Error al reportar mascota perdida:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reportar mascota perdida',
      error: error.message
    });
  }
};

// @desc    Reportar mascota como encontrada (UC7)
// @route   POST /api/reportes/encontrada
// @access  Private (solo dueños)
exports.reportarMascotaEncontrada = async (req, res) => {
  try {
    const { mascotaId } = req.body;

    if (!mascotaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la mascota es obligatorio'
      });
    }

    // Verificar que la mascota existe y pertenece al usuario
    const mascota = await Mascota.findByPk(mascotaId);

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    if (mascota.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para reportar esta mascota'
      });
    }

    // Verificar el estado actual
    const estadoActual = await EstadoMascota.findOne({
      where: { mascotaId },
      order: [['createdAt', 'DESC']]
    });

    if (estadoActual && estadoActual.estado === 'recuperada') {
      return res.status(400).json({
        success: false,
        message: 'La mascota ya se encuentra reportada como encontrada'
      });
    }

    // Actualizar estado
    await EstadoMascota.create({
      mascotaId,
      estado: 'recuperada',
      razonCambio: 'Reportado como encontrado por el dueño'
    });

    // Buscar reporte activo y marcarlo como resuelto
    const reporteActivo = await ReporteMascota.findOne({
      where: {
        mascotaId,
        estadoReporte: 'activo'
      }
    });

    if (reporteActivo) {
      await reporteActivo.update({
        estadoReporte: 'resuelto',
        fechaResolucion: new Date()
      });

      // Generar alerta de mascota recuperada
      const alerta = await Alerta.create({
        reporteId: reporteActivo.id,
        descripcionMensaje: `✅ MASCOTA RECUPERADA: ${mascota.nombre} ha sido encontrada por su dueño.`,
        enviado: true,
        tipoAlerta: 'mascota_recuperada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mascota reportada como encontrada exitosamente',
      data: {
        mascota: {
          id: mascota.id,
          nombre: mascota.nombre,
          estado: 'recuperada'
        }
      }
    });
  } catch (error) {
    console.error('Error al reportar mascota encontrada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reportar mascota encontrada',
      error: error.message
    });
  }
};

// @desc    Obtener reportes activos
// @route   GET /api/reportes/activos
// @access  Public
exports.obtenerReportesActivos = async (req, res) => {
  try {
    const reportes = await ReporteMascota.findAll({
      where: { estadoReporte: 'activo' },
      include: [
        {
          model: Mascota,
          as: 'mascota',
          include: [
            {
              model: User,
              as: 'dueno',
              attributes: ['id', 'nombre', 'apellido', 'celular', 'permitirVisualizacionDatos']
            }
          ]
        },
        {
          model: Ubicacion,
          as: 'ubicacion'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: reportes
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reportes',
      error: error.message
    });
  }
};

// @desc    Obtener ubicación de mascota (UC9)
// @route   GET /api/reportes/mascota/:mascotaId/ubicacion
// @access  Private (solo dueño)
exports.obtenerUbicacionMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    // Verificar que la mascota pertenece al usuario
    const mascota = await Mascota.findByPk(mascotaId);

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    if (mascota.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver la ubicación de esta mascota'
      });
    }

    // Obtener el reporte más reciente
    const reporteReciente = await ReporteMascota.findOne({
      where: { mascotaId },
      include: [
        {
          model: Ubicacion,
          as: 'ubicacion'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!reporteReciente) {
      return res.status(404).json({
        success: false,
        message: 'No hay reportes para esta mascota'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mascota: {
          id: mascota.id,
          nombre: mascota.nombre
        },
        ubicacion: reporteReciente.ubicacion,
        fechaReporte: reporteReciente.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ubicación',
      error: error.message
    });
  }
};

module.exports = exports;
