const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ubicacion = sequelize.define('Ubicacion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90,
      notNull: {
        msg: 'La latitud es obligatoria'
      }
    }
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180,
      notNull: {
        msg: 'La longitud es obligatoria'
      }
    }
  },
  descripcionLugar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  precisionMetros: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'ubicaciones',
  timestamps: true
});

module.exports = Ubicacion;
