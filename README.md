# Sistema de recuperación de mascotas perdidas en Oro Verde

## Descripción
Sistema web para el registro y recuperación de mascotas extraviadas en Oro Verde, Entre Ríos.

## Equipo
- [Ana Sol Murzi] - Responsable del Repositorio
- [Priscila Antonella Inderkumer] - Colaborador

## Tecnologías Utilizadas

### Backend
- **Node.js** + **Express.js** - Framework del servidor
- **PostgreSQL** - Base de datos relacional
- **Sequelize ORM** - Mapeo objeto-relacional
- **JWT** - Autenticación y autorización
- **bcrypt** - Hash de contraseñas
- **Jest** - Testing unitario
- **Axios** - Cliente HTTP para APIs externas

### Frontend
- En desarrollo

### Herramientas de Desarrollo
- **Nodemon** - Desarrollo con hot-reload
- **dotenv** - Gestión de variables de entorno
- **CORS** - Configuración de Cross-Origin Resource Sharing

## Arquitectura del Sistema

### Patrón Arquitectónico
El proyecto implementa una **Arquitectura en Capas (Layered Architecture)** con separación de responsabilidades:

```
Cliente (Browser)
    ↓
CAPA 1: Rutas (Routes)
    ↓
CAPA 2: Controladores (Controllers)
    ↓
CAPA 3: Servicios (Services)  Parcialmente implementado
    ↓
CAPA 4: Modelos (Models + Sequelize ORM)
    ↓
Base de Datos (PostgreSQL)
```

### Estructura de Carpetas

```
server/
├── src/
│   ├── config/              # Configuración (database.js)
│   ├── controllers/         # Controladores HTTP
│   │   ├── auth.controller.js
│   │   ├── mascota.controller.js
│   │   ├── reporte.controller.js
│   │   └── geolocalizacion.controller.js
│   ├── services/            # Lógica de negocio
│   │   └── geolocalizacion.service.js
│   ├── models/              # Modelos de datos (Sequelize)
│   │   ├── Usuario.js
│   │   ├── Mascota.js
│   │   ├── ReporteMascota.js
│   │   ├── Ubicacion.js
│   │   ├── Alerta.js
│   │   ├── Notificacion.js
│   │   └── EstadoMascota.js
│   ├── routes/              # Definición de rutas
│   ├── middleware/          # Middleware personalizado
│   │   └── auth.middleware.js
│   └── utils/               # Utilidades
├── tests/                   # Tests unitarios
│   ├── uc21-reportar-mascota.test.js
│   └── uc23-consultar-ubicacion.test.js
└── index.js                 # Punto de entrada
```

## Estructura del Repositorio
- `documentacion/`: Documentos de requerimientos, especificaciones y manuales
- `diseño/`: Diagramas, mockups y documentos de arquitectura
- `server/`: Código fuente del backend (Node.js + Express)
- `client/`: Código fuente del frontend (en desarrollo)
- `recursos/`: Imágenes, plantillas y otros recursos

## Instalación y Configuración

### Requisitos Previos
- Node.js (v19 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/AnaaSol/Sistema-de-recuperacion-de-mascotas-perdidas-en-Oro-Verde.git
cd Sistema-de-recuperacion-de-mascotas-perdidas-en-Oro-Verde
```

2. Instalar dependencias del servidor:
```bash
cd server
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tu configuración de base de datos
```

4. Crear la base de datos:
```bash
createdb mascotas_db
```

5. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### Testing
```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar nuevo usuario
- `GET /api/auth/perfil` - Obtener perfil del usuario (requiere autenticación)

### Mascotas
- `POST /api/mascotas` - Registrar nueva mascota
- `GET /api/mascotas` - Listar mascotas del usuario
- `GET /api/mascotas/:id` - Obtener detalle de mascota
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota

### Reportes
- `POST /api/reportes` - Reportar mascota perdida (UC21)
- `GET /api/reportes` - Listar reportes
- `GET /api/reportes/:id` - Obtener detalle de reporte
- `PUT /api/reportes/:id` - Actualizar reporte

### Geolocalización
- `POST /api/geolocalizacion/consultar` - Consultar ubicación (UC23)
- `GET /api/geolocalizacion/ubicacion/:id` - Obtener dirección de ubicación
- `POST /api/geolocalizacion/geocodificar` - Convertir dirección a coordenadas
- `POST /api/geolocalizacion/distancia` - Calcular distancia entre ubicaciones
- `POST /api/geolocalizacion/cercanas` - Buscar mascotas cercanas

## Estado del Proyecto

### Completado
- Configuración de base de datos con Sequelize
- Modelos de datos y relaciones
- Sistema de autenticación con JWT
- API REST para mascotas y reportes
- Generación automática de alertas
- Sistema de geolocalización
- Tests unitarios para UC21 y UC23

### En Desarrollo
- Frontend (cliente web)
- Capa de servicios completa (falta implementar auth, mascota, reporte, notificacion)
- Integración con API de geolocalización externa real
- Sistema de notificaciones por email/SMS

### Pendiente
- Implementación completa de todos los casos de uso
- Panel de administración
- Reportes y estadísticas
- Aplicación móvil

## Licencia
Este proyecto es parte de un Trabajo Práctico Integrador de Ingeniería de Software II.

## Última Actualización
[04-11-2025] - v2.0


