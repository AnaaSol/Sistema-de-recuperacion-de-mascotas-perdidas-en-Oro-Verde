import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Interceptor: agrega el token JWT 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de Autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

//  Servicios para Mascotas
export const mascotaService = {
  registrar: async (mascotaData) => {
    const response = await api.post('/mascotas', mascotaData);
    return response.data;
  },

  obtenerMisMascotas: async () => {
    const response = await api.get('/mascotas');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/mascotas/${id}`);
    return response.data;
  },

  modificar: async (id, mascotaData) => {
    const response = await api.put(`/mascotas/${id}`, mascotaData);
    return response.data;
  },
};

//  Servicios para Reportes
export const reporteService = {
  reportarPerdida: async (reporteData) => {
    const response = await api.post('/reportes/perdida', reporteData);
    return response.data;
  },

  reportarEncontrada: async (mascotaId) => {
    const response = await api.post('/reportes/encontrada', { mascotaId });
    return response.data;
  },

  obtenerActivos: async () => {
    const response = await api.get('/reportes/activos');
    return response.data;
  },
};

//  Servicios de Geolocalización 
export const geoService = {
  consultarUbicacion: async (latitud, longitud) => {
    const response = await api.post('/geolocalizacion/consultar', {
      latitud,
      longitud,
    });
    return response.data;
  },

  buscarCercanas: async (latitud, longitud, radioKm = 5) => {
    const response = await api.post('/geolocalizacion/mascotas-cercanas', {
      latitud,
      longitud,
      radioKm,
    });
    return response.data;
  },
};

export default api;
