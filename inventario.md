# Inventario de Elementos de Configuración
## Resumen
- **Total de CIs:** 11
- **Fecha de inventario:** 2025-11-04
- **Responsable:** Equipo TPI Grupo 1

## Inventario Completo de CIs
| ID     | Nombre del Archivo                      | Categoría     | Versión | Ubicación                                                       | Responsable | Criticidad | Última Modificación |
|--------|-----------------------------------------|---------------|---------|-----------------------------------------------------------------|-------------|------------|---------------------|
| CI-001 | TPI_Grupo1_flujosInformacion.drawio     | Diseño        | 1.0     | /diseño/diagramas                                               | Priscila I. | Media      | 2025-08-27 |
| CI-002 | TPI_Grupo1_entidades.drawio             | Diseño        | 1.0     | /diseño/diagramas                                               | Priscila I. | Media      | 2025-08-27 |
| CI-003 | TPI_Grupo1_diagramaDeContexto.drawio    | Diseño        | 1.0     | /diseño/arquitectura                                            | Priscila I. | Media      | 2025-08-27 |
| CI-004 | TP_Final_INFORME                        | Documentación | 1.0     | /documentacion/especificaciones                                 | Priscila I. | Alta       | 2025-06-10 |
| CI-005 | entidades.drawio.png                    | Diseño        | 1.0     | /diseño/diagramas/CI-005_TPI_Grupo1_entidades.drawio            | Ana M.      | Baja       | 2025-05-05 |
| CI-006 | Casos de uso                            | Documentación | 1.0     | /documentacion/casos_de_uso/CI-006_casos_de_uso.xlxs            | Ana M.      | Alta       | 2025-05-12 |
| CI-007 | Atributos de calidad                    | Documentación | 1.0     | /documentacion/especificaciones/CI-007_atributos_de_calidad.xlxs| Ana M.      | Alta       | 2025-06-10 |
| CI-008 | Backend (server/)                       | Código        | 2.0     | /server                                                         | Ana M.      | Alta       | 2025-11-04 |
| CI-009 | Tests UC22                       | Código        | 1.0     | /server/tests                                                   | Ana M. | Alta       | 2025-11-04 |
| CI-010 | Tests UC23                       | Código        | 1.0     | /server/tests                                                   | Priscila I. | Alta       | 2025-11-04 |
| CI-011 | README.md                               | Código        | 2.0     | /                                                               | Ana M.      | Alta       | 2025-11-04 |

## Estadísticas por Categoría
- **Documentación:** 3 CIs
- **Diseño:** 4 CIs
- **Código:** 4 CIs
- **Recursos:** 0 CIs

## Estadísticas por Criticidad
- **Criticidad Alta:** 7 CIs
- **Criticidad Media:** 3 CIs
- **Criticidad Baja:** 1 CI

## Detalle de Nuevos CIs (v2.0)

### CI-008: Código Backend
- **Descripción:** Implementación completa del backend con arquitectura en capas
- **Tecnologías:** Node.js, Express.js, Sequelize, PostgreSQL, JWT, bcrypt
- **Estructura:**
  - `src/config/` - Configuración de base de datos
  - `src/controllers/` - 4 controladores (auth, mascota, reporte, geolocalizacion)
  - `src/services/` - 1 servicio implementado (geolocalizacion)
  - `src/models/` - 7 modelos de datos
  - `src/routes/` - Definición de rutas API REST
  - `src/middleware/` - Middleware de autenticación
- **Casos de Uso Implementados:** UC21, UC22, UC23

### CI-009: Tests Unitarios
- **Descripción:** Tests unitarios con Jest para casos de uso UC22 (reportar mascota perdida) 
- **Cobertura:** Casos exitosos y manejo de errores
- **Framework:** Jest con mocks de axios

### CI-0010: Tests Unitarios
- **Descripción:** Tests unitarios con Jest para casos de uso UC23 (consultar ubicación)
- **Cobertura:** Casos exitosos y manejo de errores
- **Framework:** Jest con mocks de axios

### CI-011: Documentación del Proyecto (README)
- **Descripción:** Documentación completa del proyecto actualizada con arquitectura, tecnologías, instalación, API endpoints y estado del proyecto
- **Versión:** 2.0
- **Contenido:**
  - Descripción de tecnologías utilizadas
  - Arquitectura en capas
  - Estructura del proyecto
  - Guía de instalación y configuración
  - Documentación de API endpoints
  - Estado del proyecto


## Estado de Implementación

### Completado
- Configuración de base de datos con Sequelize
- Modelos de datos y relaciones (7 modelos)
- Sistema de autenticación con JWT
- API REST para mascotas y reportes
- Generación automática de alertas
- Sistema de geolocalización
- Tests unitarios para UC21 y UC23
- Documentación completa del proyecto

### En Desarrollo
- Frontend (cliente web)
- Capa de servicios completa (implementado 1 de 5 servicios)
- Integración con API de geolocalización externa real
- Sistema de notificaciones por email/SMS

### Estado por Capa de Arquitectura
- **Capa 1 (Rutas):** 100% - 4 módulos de rutas
- **Capa 2 (Controladores):** 100% - 4 controladores
- **Capa 3 (Servicios):** 20% - Solo geolocalizacion.service.js
- **Capa 4 (Modelos):** 100% - 7 modelos con relaciones

## Historial de Cambios

### v2.0 (2025-11-04)
- Implementación inicial del backend
- Arquitectura en capas definida y documentada
- Tests unitarios UC21 y UC23
- README actualizado con documentación completa
- Agregados 3 nuevos CIs de código

### v1.0 (2025-08-31)
- Documentación inicial
- Diagramas de diseño
- Especificaciones y casos de uso
- Total: 7 CIs
