require('dotenv').config();
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

async function sincronizarDB() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✓ Conexión establecida');

    console.log('\n🔄 Sincronizando modelos con la base de datos...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Modelos sincronizados');

    console.log('\n📋 Verificando tablas creadas...');
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\nTablas en la base de datos:');
    tables.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.table_name}`);
    });

    console.log('\n✅ Sincronización completada!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

sincronizarDB();
