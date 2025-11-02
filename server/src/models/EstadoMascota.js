const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EstadoMascota = sequelize.define('EstadoMascota', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mascotaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'mascotas',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('activa', 'perdida', 'encontrada', 'recuperada', 'fallecida'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['activa', 'perdida', 'encontrada', 'recuperada', 'fallecida']],
        msg: 'Estado no válido'
      }
    }
  },
  razonCambio: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'estados_mascota',
  timestamps: true,
  updatedAt: false // Solo createdAt, no se actualiza
});

module.exports = EstadoMascota;
