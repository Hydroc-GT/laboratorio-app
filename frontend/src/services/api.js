import axios from 'axios';

// Base URL configurable mediante variable de entorno
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: Inyecta el token Bearer JWT y headers de sesión
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Retrocompatibilidad con header user-id si existe usuario en localStorage
    const usuarioRaw = localStorage.getItem('usuario');
    if (usuarioRaw) {
      try {
        const usuario = JSON.parse(usuarioRaw);
        if (usuario && usuario.IdUsuario) {
          config.headers['user-id'] = usuario.IdUsuario;
        }
      } catch (e) {
        // Ignorar error de parseo
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas: Manejo global de expiración de sesión (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si la sesión expiró y no estamos en la página de login, limpiar y redirigir
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { api, API_BASE_URL };
