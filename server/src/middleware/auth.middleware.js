const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar JWT
exports.proteger = async (req, res, next) => {
  let token;

  // Verificar si el token está en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta. Token no proporcionado.'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-temporal');

    // Obtener usuario del token
    req.usuario = await User.findById(decoded.id);

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!req.usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta. Token inválido.'
    });
  }
};

// Autorizar roles específicos
exports.autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.usuario.rol}' no está autorizado para acceder a este recurso`
      });
    }
    next();
  };
};
