const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { conectarDB } = require('./config/database');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Recuperación de Mascotas Perdidas',
    version: '1.0.0'
  });
});

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Mascota routes
const mascotaRoutes = require('./routes/mascota.routes');
app.use('/api/mascotas', mascotaRoutes);

// Reporte routes
const reporteRoutes = require('./routes/reporte.routes');
app.use('/api/reportes', reporteRoutes);

// Geolocalización routes
const geolocalizacionRoutes = require('./routes/geolocalizacion.routes');
app.use('/api/geolocalizacion', geolocalizacionRoutes);

const PORT = process.env.PORT || 3000;

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
