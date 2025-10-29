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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
