const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ReporteMascota = sequelize.define('ReporteMascota', {
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
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tipoReporte: {
    type: DataTypes.ENUM('perdida', 'encontrada', 'vista'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['perdida', 'encontrada', 'vista']],
        msg: 'Tipo de reporte no válido'
      }
    }
  },
  estadoReporte: {
    type: DataTypes.ENUM('activo', 'resuelto', 'cancelado'),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'resuelto', 'cancelado']],
        msg: 'Estado de reporte no válido'
      }
    }
  },
  ubicacionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ubicaciones',
      key: 'id'
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripción es obligatoria'
      }
    }
  },
  fechaResolucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  coincidenciasEncontradas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'reportes_mascota',
  timestamps: true
});

module.exports = ReporteMascota;
