const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-temporal', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, celular, direccion, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !password || !celular) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos obligatorios'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      apellido,
      email,
      password,
      celular,
      direccion,
      rol: rol || 'vecino' // Por defecto, se registra como vecino
    });

    // Generar token
    const token = generarToken(usuario.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          celular: usuario.celular,
          direccion: usuario.direccion,
          rol: usuario.rol
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
exports.iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese email y contraseña'
      });
    }

    // Buscar usuario por email
    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Generar token
    const token = generarToken(usuario.id);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          celular: usuario.celular,
          direccion: usuario.direccion,
          rol: usuario.rol
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.usuario.id);

    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// @desc    Modificar datos personales
// @route   PUT /api/auth/perfil
// @access  Private
exports.modificarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, celular, direccion, permitirVisualizacionDatos } = req.body;

    const camposActualizables = {};
    if (nombre) camposActualizables.nombre = nombre;
    if (apellido) camposActualizables.apellido = apellido;
    if (celular) camposActualizables.celular = celular;
    if (direccion !== undefined) camposActualizables.direccion = direccion;
    if (permitirVisualizacionDatos !== undefined) {
      camposActualizables.permitirVisualizacionDatos = permitirVisualizacionDatos;
    }

    await User.update(
      camposActualizables,
      {
        where: { id: req.usuario.id },
        validate: true
      }
    );

    const usuario = await User.findByPk(req.usuario.id);

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al modificar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al modificar perfil',
      error: error.message
    });
  }
};
