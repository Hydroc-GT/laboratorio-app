import axios from 'axios';

// Asegúrate de que este sea el puerto de tu backend
const API_URL = 'http://localhost:3001/api/auth'; 

// El registro ahora incluye el rol
export const register = async (userData) => {
    // userData debe ser un objeto como { nombre, correo, contrasena, idRol }
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (credentials) => {
    // credentials debe ser un objeto como { correo, contrasena }
    const response = await axios.post(`${API_URL}/login`, credentials);
    // Guarda el token en localStorage para mantener la sesión
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

