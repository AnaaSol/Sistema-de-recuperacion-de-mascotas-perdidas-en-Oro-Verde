const request = require('supertest');
const app = require('../src/index');
const { sequelize, User, Mascota, EstadoMascota, ReporteMascota, Ubicacion, Alerta, Notificacion } = require('../src/models');

describe('UC22 - Generar alerta de mascota perdida', () => {
  let authToken;
  let duenoId;
  let mascotaId;
  const timestamp = Date.now();
  const duenoEmail = `test.dueno.${timestamp}@test.com`;
  const vecinoEmail = `test.vecino.${timestamp}@test.com`;

  // Setup: Crear usuario dueño y mascota antes de los tests
  beforeAll(async () => {
    // Sincronizar base de datos (sin force: true para no eliminar tablas en uso)
    await sequelize.sync();

    // Crear usuario dueño
    const dueno = await User.create({
      nombre: 'Test',
      apellido: 'Dueño',
      email: duenoEmail,
      password: 'password123',
      celular: '3415551234',
      rol: 'dueno',
      permitirVisualizacionDatos: true,
      activo: true
    });
    duenoId = dueno.id;

    // Crear vecino para notificaciones
    await User.create({
      nombre: 'Test',
      apellido: 'Vecino',
      email: vecinoEmail,
      password: 'password123',
      celular: '3415555678',
      rol: 'vecino',
      activo: true
    });

    // Login para obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: duenoEmail,
        password: 'password123'
      });

    if (loginResponse.status !== 200 || !loginResponse.body.data?.token) {
      console.error('Login failed:', loginResponse.body);
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    authToken = loginResponse.body.data.token;

    // Crear mascota
    const mascota = await Mascota.create({
      nombre: 'Max',
      raza: 'Labrador',
      especie: 'Perro',
      fotoUrl: 'https://example.com/max.jpg',
      tamano: 'grande',
      colores: 'Amarillo',
      chip: `TEST${timestamp}`,
      observaciones: 'Muy amigable',
      usuarioId: duenoId
    });
    mascotaId = mascota.id;

    // Crear estado inicial
    await EstadoMascota.create({
      mascotaId: mascota.id,
      estado: 'activa',
      razonCambio: 'Registro inicial'
    });
  }, 15000); // Timeout de 15 segundos para el setup

  // Cleanup: Limpiar base de datos después de los tests
  afterAll(async () => {
    await sequelize.close();
  });

  // TEST 1: Reportar mascota perdida y generar alerta exitosamente
  test('Debe reportar mascota perdida y generar alerta automáticamente', async () => {
    const reporteData = {
      mascotaId: mascotaId,
      latitud: -31.7833,
      longitud: -60.5167,
      descripcionLugar: 'Plaza San Martín, Oro Verde',
      descripcion: 'Se perdió esta mañana cerca de la plaza'
    };

    const response = await request(app)
      .post('/api/reportes/perdida')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reporteData);

    // Verificar respuesta HTTP
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('alerta generada');

    // Verificar que se creó el reporte
    expect(response.body.data.reporte).toBeDefined();
    expect(response.body.data.reporte.tipoReporte).toBe('perdida');
    expect(response.body.data.reporte.estadoReporte).toBe('activo');

    // Verificar que se creó la alerta
    expect(response.body.data.alerta).toBeDefined();
    expect(response.body.data.alerta.mensaje).toContain('MASCOTA PERDIDA');
    expect(response.body.data.alerta.mensaje).toContain('Max');
    expect(response.body.data.alerta.mensaje).toContain('Labrador');

    // Verificar que se generaron notificaciones
    expect(response.body.data.alerta.notificacionesEnviadas).toBeGreaterThan(0);

    // Verificar en base de datos que se creó el reporte
    const reporteDB = await ReporteMascota.findOne({
      where: { mascotaId: mascotaId, tipoReporte: 'perdida' }
    });
    expect(reporteDB).not.toBeNull();
    expect(reporteDB.estadoReporte).toBe('activo');

    // Verificar que se actualizó el estado de la mascota a 'perdida'
    const estadoActual = await EstadoMascota.findOne({
      where: { mascotaId: mascotaId },
      order: [['createdAt', 'DESC']]
    });
    expect(estadoActual).not.toBeNull();
    expect(estadoActual.estado).toBe('perdida');
    expect(estadoActual.razonCambio).toBe('Reportado como perdido');

    // Verificar que se creó la alerta en base de datos
    const alertaDB = await Alerta.findOne({
      where: { reporteId: reporteDB.id }
    });
    expect(alertaDB).not.toBeNull();
    expect(alertaDB.tipoAlerta).toBe('mascota_perdida');
    expect(alertaDB.enviado).toBe(true);
    expect(alertaDB.descripcionMensaje).toContain('Max');

    // Verificar que se crearon notificaciones para vecinos
    const notificaciones = await Notificacion.findAll({
      where: { alertaId: alertaDB.id }
    });
    expect(notificaciones.length).toBeGreaterThan(0);
    expect(notificaciones[0].estado).toBe('pendiente');
    expect(notificaciones[0].canal).toBe('email');
  });

  // TEST 2: Rechazar reporte si faltan campos obligatorios
  test('Debe rechazar reporte de mascota perdida si faltan campos obligatorios', async () => {
    // Contar alertas antes del test
    const alertasAntes = await Alerta.count();

    const reporteIncompleto = {
      mascotaId: mascotaId,
      latitud: -31.7833
      // Falta longitud y descripcion
    };

    const response = await request(app)
      .post('/api/reportes/perdida')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reporteIncompleto);

    // Verificar respuesta HTTP
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('campos obligatorios');

    // Verificar que NO se creó el reporte en base de datos
    const reportesCount = await ReporteMascota.count({
      where: { mascotaId: mascotaId, descripcion: null }
    });
    expect(reportesCount).toBe(0);

    // Verificar que NO se crearon alertas adicionales
    const alertasDespues = await Alerta.count();
    expect(alertasDespues).toBe(alertasAntes); // No debe haber alertas nuevas
  });
});
