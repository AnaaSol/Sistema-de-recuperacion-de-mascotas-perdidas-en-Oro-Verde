const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
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
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido es obligatorio'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'El email ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Por favor ingrese un email válido'
      },
      notEmpty: {
        msg: 'El email es obligatorio'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es obligatoria'
      },
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El número de celular es obligatorio'
      }
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('dueno', 'vecino', 'municipalidad'),
    defaultValue: 'vecino',
    allowNull: false
  },
  permitirVisualizacionDatos: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    // Hook para hashear la contraseña antes de crear
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hook para hashear la contraseña antes de actualizar
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para comparar contraseñas
User.prototype.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para obtener datos públicos del usuario (sin contraseña)
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
