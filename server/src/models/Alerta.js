const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alerta = sequelize.define('Alerta', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reporteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'reportes_mascota',
      key: 'id'
    }
  },
  descripcionMensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El mensaje de la alerta es obligatorio'
      }
    }
  },
  enviado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  tipoAlerta: {
    type: DataTypes.ENUM('mascota_perdida', 'mascota_encontrada', 'mascota_vista', 'mascota_recuperada'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['mascota_perdida', 'mascota_encontrada', 'mascota_vista', 'mascota_recuperada']],
        msg: 'Tipo de alerta no válido'
      }
    }
  }
}, {
  tableName: 'alertas',
  timestamps: true
});

module.exports = Alerta;
