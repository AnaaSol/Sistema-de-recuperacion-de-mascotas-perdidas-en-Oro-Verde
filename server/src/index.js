const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Recuperación de Mascotas Perdidas' });
});

// TODO: Importar y usar las rutas cuando estén creadas
// const mascotasRoutes = require('./routes/mascotas.routes');
// app.use('/api/mascotas', mascotasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
