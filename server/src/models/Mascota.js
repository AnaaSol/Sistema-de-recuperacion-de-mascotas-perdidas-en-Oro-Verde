const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mascota = sequelize.define('Mascota', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es obligatorio'
      }
    }
  },
  raza: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La raza es obligatoria'
      }
    }
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La especie es obligatoria'
      }
    }
  },
  fotoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La foto es obligatoria para la identificación'
      }
    }
  },
  tamano: {
    type: DataTypes.ENUM('pequeno', 'mediano', 'grande'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['pequeno', 'mediano', 'grande']],
        msg: 'El tamaño debe ser pequeño, mediano o grande'
      }
    }
  },
  colores: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Los colores son obligatorios para la identificación'
      }
    }
  },
  chip: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'mascotas',
  timestamps: true
});

module.exports = Mascota;
