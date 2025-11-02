const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  alertaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'alertas',
      key: 'id'
    }
  },
  canal: {
    type: DataTypes.ENUM('email', 'sms', 'whatsapp', 'push_notification'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['email', 'sms', 'whatsapp', 'push_notification']],
        msg: 'Canal de notificación no válido'
      }
    }
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contenido de la notificación es obligatorio'
      }
    }
  },
  fechaLectura: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'enviado', 'leido', 'fallido'),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'enviado', 'leido', 'fallido']],
        msg: 'Estado de notificación no válido'
      }
    }
  },
  reintentos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 3
    }
  }
}, {
  tableName: 'notificaciones',
  timestamps: true
});

module.exports = Notificacion;
