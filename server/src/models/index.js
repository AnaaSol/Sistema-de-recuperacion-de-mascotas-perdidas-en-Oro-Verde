const User = require('./User');
const Mascota = require('./Mascota');
const Ubicacion = require('./Ubicacion');
const ReporteMascota = require('./ReporteMascota');
const EstadoMascota = require('./EstadoMascota');
const Alerta = require('./Alerta');
const Notificacion = require('./Notificacion');

// ===== RELACIONES =====

// Usuario - Mascota (1:N)
User.hasMany(Mascota, {
  foreignKey: 'usuarioId',
  as: 'mascotas'
});
Mascota.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'dueno'
});

// Usuario - ReporteMascota (1:N)
User.hasMany(ReporteMascota, {
  foreignKey: 'usuarioId',
  as: 'reportes'
});
ReporteMascota.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'reportador'
});

// Mascota - ReporteMascota (1:N)
Mascota.hasMany(ReporteMascota, {
  foreignKey: 'mascotaId',
  as: 'reportes'
});
ReporteMascota.belongsTo(Mascota, {
  foreignKey: 'mascotaId',
  as: 'mascota'
});

// Mascota - EstadoMascota (1:N)
Mascota.hasMany(EstadoMascota, {
  foreignKey: 'mascotaId',
  as: 'historialEstados'
});
EstadoMascota.belongsTo(Mascota, {
  foreignKey: 'mascotaId',
  as: 'mascota'
});

// Ubicacion - ReporteMascota (1:N)
Ubicacion.hasMany(ReporteMascota, {
  foreignKey: 'ubicacionId',
  as: 'reportes'
});
ReporteMascota.belongsTo(Ubicacion, {
  foreignKey: 'ubicacionId',
  as: 'ubicacion'
});

// ReporteMascota - Alerta (1:N)
ReporteMascota.hasMany(Alerta, {
  foreignKey: 'reporteId',
  as: 'alertas'
});
Alerta.belongsTo(ReporteMascota, {
  foreignKey: 'reporteId',
  as: 'reporte'
});

// Alerta - Notificacion (1:N)
Alerta.hasMany(Notificacion, {
  foreignKey: 'alertaId',
  as: 'notificaciones'
});
Notificacion.belongsTo(Alerta, {
  foreignKey: 'alertaId',
  as: 'alerta'
});

// Usuario - Notificacion (1:N)
User.hasMany(Notificacion, {
  foreignKey: 'usuarioId',
  as: 'notificaciones'
});
Notificacion.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

module.exports = {
  User,
  Mascota,
  Ubicacion,
  ReporteMascota,
  EstadoMascota,
  Alerta,
  Notificacion
};
