const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mascotas_perdidas',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a PostgreSQL establecida correctamente');

    // Sincronizar modelos con la base de datos
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, conectarDB };
