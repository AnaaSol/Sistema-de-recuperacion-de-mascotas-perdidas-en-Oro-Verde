require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User, Mascota, Ubicacion, ReporteMascota, EstadoMascota, Alerta, Notificacion } = require('./src/models');

async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✓ Conexión a la base de datos establecida');

    // Sincronizar modelos (crear tablas)
    console.log('\n🔄 Sincronizando modelos...');
    await sequelize.sync({ force: true }); // force:true borra y recrea las tablas
    console.log('✓ Modelos sincronizados\n');

    // ===== CREAR USUARIOS DE PRUEBA =====
    console.log('👥 Creando usuarios de prueba...');

    const dueno = await User.create({
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'dueno@example.com',
      password: 'password123',
      celular: '3415551234',
      direccion: 'Calle Principal 123, Oro Verde',
      rol: 'dueno',
      permitirVisualizacionDatos: true,
      activo: true
    });
    console.log('  ✓ Usuario Dueño creado:', dueno.email);

    const vecino = await User.create({
      nombre: 'María',
      apellido: 'González',
      email: 'vecino@example.com',
      password: 'password123',
      celular: '3415555678',
      direccion: 'Avenida San Martín 456, Oro Verde',
      rol: 'vecino',
      permitirVisualizacionDatos: true,
      activo: true
    });
    console.log('  ✓ Usuario Vecino creado:', vecino.email);

    const municipalidad = await User.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'municipalidad@oroverde.gob.ar',
      password: 'password123',
      celular: '3415559999',
      direccion: 'Municipalidad de Oro Verde',
      rol: 'municipalidad',
      permitirVisualizacionDatos: false,
      activo: true
    });
    console.log('  ✓ Usuario Municipalidad creado:', municipalidad.email);

    // ===== CREAR MASCOTAS DE EJEMPLO =====
    console.log('\n🐕 Creando mascotas de ejemplo...');

    const mascota1 = await Mascota.create({
      nombre: 'Max',
      raza: 'Labrador',
      especie: 'Perro',
      fotoUrl: 'https://example.com/photos/max.jpg',
      tamano: 'grande',
      colores: 'Dorado y blanco',
      chip: 'ARG123456789',
      observaciones: 'Muy amigable, responde al nombre',
      usuarioId: dueno.id
    });
    console.log('  ✓ Mascota creada:', mascota1.nombre);

    const mascota2 = await Mascota.create({
      nombre: 'Luna',
      raza: 'Siamés',
      especie: 'Gato',
      fotoUrl: 'https://example.com/photos/luna.jpg',
      tamano: 'pequeno',
      colores: 'Gris con manchas blancas',
      observaciones: 'Tímida con extraños',
      usuarioId: dueno.id
    });
    console.log('  ✓ Mascota creada:', mascota2.nombre);

    // ===== CREAR ESTADO INICIAL DE MASCOTAS =====
    console.log('\n📊 Creando estados iniciales de mascotas...');

    await EstadoMascota.create({
      mascotaId: mascota1.id,
      estado: 'activa',
      razonCambio: 'Registro inicial'
    });
    console.log('  ✓ Estado creado para:', mascota1.nombre);

    await EstadoMascota.create({
      mascotaId: mascota2.id,
      estado: 'activa',
      razonCambio: 'Registro inicial'
    });
    console.log('  ✓ Estado creado para:', mascota2.nombre);

    // ===== CREAR UBICACIÓN DE EJEMPLO =====
    console.log('\n📍 Creando ubicación de ejemplo...');

    const ubicacion = await Ubicacion.create({
      latitud: -31.7833,
      longitud: -60.5167,
      descripcionLugar: 'Plaza Central de Oro Verde',
      precisionMetros: 50
    });
    console.log('  ✓ Ubicación creada:', ubicacion.descripcionLugar);

    // ===== CREAR REPORTE DE EJEMPLO =====
    console.log('\n📝 Creando reporte de mascota perdida...');

    const reporte = await ReporteMascota.create({
      mascotaId: mascota1.id,
      usuarioId: dueno.id,
      tipoReporte: 'perdida',
      estadoReporte: 'activo',
      ubicacionId: ubicacion.id,
      descripcion: 'Max se perdió esta tarde cerca de la plaza. Llevaba collar rojo.',
      coincidenciasEncontradas: 0
    });
    console.log('  ✓ Reporte creado para:', mascota1.nombre);

    // Actualizar estado de la mascota
    await EstadoMascota.create({
      mascotaId: mascota1.id,
      estado: 'perdida',
      razonCambio: 'Reportado como perdido'
    });
    console.log('  ✓ Estado actualizado a "perdida"');

    // ===== CREAR ALERTA =====
    console.log('\n🚨 Creando alerta...');

    const alerta = await Alerta.create({
      reporteId: reporte.id,
      descripcionMensaje: `ALERTA: ${mascota1.nombre} (${mascota1.raza}) se ha perdido en ${ubicacion.descripcionLugar}. Contacto: ${dueno.celular}`,
      enviado: false,
      tipoAlerta: 'mascota_perdida'
    });
    console.log('  ✓ Alerta creada');

    // ===== CREAR NOTIFICACIÓN =====
    console.log('\n📧 Creando notificación...');

    const notificacion = await Notificacion.create({
      usuarioId: vecino.id,
      alertaId: alerta.id,
      canal: 'email',
      contenido: `Hola ${vecino.nombre}, se ha reportado una mascota perdida cerca de tu zona: ${mascota1.nombre}`,
      estado: 'pendiente',
      reintentos: 0
    });
    console.log('  ✓ Notificación creada para:', vecino.email);

    // ===== RESUMEN =====
    console.log('\n' + '='.repeat(50));
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(50));
    console.log('\n📊 Resumen de datos creados:');
    console.log('  • 3 usuarios (dueño, vecino, municipalidad)');
    console.log('  • 2 mascotas (Max y Luna)');
    console.log('  • 4 estados de mascotas');
    console.log('  • 1 ubicación');
    console.log('  • 1 reporte de mascota perdida');
    console.log('  • 1 alerta');
    console.log('  • 1 notificación');

    console.log('\n🔐 Credenciales de acceso:');
    console.log('┌─────────────────┬──────────────────────────────────┬──────────────┐');
    console.log('│ Rol             │ Email                            │ Password     │');
    console.log('├─────────────────┼──────────────────────────────────┼──────────────┤');
    console.log('│ Dueño           │ dueno@example.com                │ password123  │');
    console.log('│ Vecino          │ vecino@example.com               │ password123  │');
    console.log('│ Municipalidad   │ municipalidad@oroverde.gob.ar    │ password123  │');
    console.log('└─────────────────┴──────────────────────────────────┴──────────────┘\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error(error);
    process.exit(1);
  }
}

seed();
