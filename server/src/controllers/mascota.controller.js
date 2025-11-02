const { Mascota, EstadoMascota, User } = require('../models');

// @desc    Registrar nueva mascota (UC3)
// @route   POST /api/mascotas
// @access  Private (solo dueños)
exports.registrarMascota = async (req, res) => {
  try {
    const { nombre, raza, especie, fotoUrl, tamano, colores, chip, observaciones } = req.body;

    // Validar campos obligatorios
    if (!nombre || !raza || !especie || !fotoUrl || !tamano || !colores) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos obligatorios'
      });
    }

    // Verificar si el chip ya existe (si se proporcionó)
    if (chip) {
      const mascotaExistente = await Mascota.findOne({ where: { chip } });
      if (mascotaExistente) {
        return res.status(400).json({
          success: false,
          message: 'El número de chip ya está registrado'
        });
      }
    }

    // Crear mascota
    const mascota = await Mascota.create({
      nombre,
      raza,
      especie,
      fotoUrl,
      tamano,
      colores,
      chip,
      observaciones,
      usuarioId: req.usuario.id
    });

    // Crear estado inicial
    await EstadoMascota.create({
      mascotaId: mascota.id,
      estado: 'activa',
      razonCambio: 'Registro inicial'
    });

    res.status(201).json({
      success: true,
      message: 'Mascota registrada exitosamente',
      data: mascota
    });
  } catch (error) {
    console.error('Error al registrar mascota:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar mascota',
      error: error.message
    });
  }
};

// @desc    Obtener mascotas del usuario
// @route   GET /api/mascotas
// @access  Private
exports.obtenerMascotasUsuario = async (req, res) => {
  try {
    const mascotas = await Mascota.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        {
          model: EstadoMascota,
          as: 'historialEstados',
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: mascotas
    });
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mascotas',
      error: error.message
    });
  }
};

// @desc    Obtener mascota por ID
// @route   GET /api/mascotas/:id
// @access  Private
exports.obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findByPk(req.params.id, {
      include: [
        {
          model: EstadoMascota,
          as: 'historialEstados',
          order: [['createdAt', 'DESC']]
        },
        {
          model: User,
          as: 'dueno',
          attributes: ['id', 'nombre', 'apellido', 'celular', 'email', 'permitirVisualizacionDatos']
        }
      ]
    });

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: mascota
    });
  } catch (error) {
    console.error('Error al obtener mascota:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mascota',
      error: error.message
    });
  }
};

// @desc    Modificar datos de mascota (UC5)
// @route   PUT /api/mascotas/:id
// @access  Private (solo el dueño)
exports.modificarMascota = async (req, res) => {
  try {
    const { nombre, raza, fotoUrl, tamano, colores, observaciones } = req.body;

    const mascota = await Mascota.findByPk(req.params.id);

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño
    if (mascota.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para modificar esta mascota'
      });
    }

    // Actualizar campos (especie y chip no se pueden modificar según reglas de negocio)
    const camposActualizables = {};
    if (nombre) camposActualizables.nombre = nombre;
    if (raza) camposActualizables.raza = raza;
    if (fotoUrl) camposActualizables.fotoUrl = fotoUrl;
    if (tamano) camposActualizables.tamano = tamano;
    if (colores) camposActualizables.colores = colores;
    if (observaciones !== undefined) camposActualizables.observaciones = observaciones;

    await Mascota.update(
      camposActualizables,
      { where: { id: req.params.id } }
    );

    const mascotaActualizada = await Mascota.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mascota actualizada exitosamente',
      data: mascotaActualizada
    });
  } catch (error) {
    console.error('Error al modificar mascota:', error);
    res.status(500).json({
      success: false,
      message: 'Error al modificar mascota',
      error: error.message
    });
  }
};

// @desc    Obtener estado actual de mascota (UC8)
// @route   GET /api/mascotas/:id/estado
// @access  Private (solo el dueño)
exports.obtenerEstadoMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByPk(req.params.id);

    if (!mascota) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño
    if (mascota.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver el estado de esta mascota'
      });
    }

    const estadoActual = await EstadoMascota.findOne({
      where: { mascotaId: req.params.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        mascota: {
          id: mascota.id,
          nombre: mascota.nombre
        },
        estado: estadoActual
      }
    });
  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado de la mascota',
      error: error.message
    });
  }
};

module.exports = exports;
