import api from './api';

// El registro incluye el rol
export const register = async (userData) => {
    // userData debe ser un objeto como { Nombre, Correo, Contrasena, IdRol }
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    // credentials: { Correo, Contrasena }
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const raw = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed.usuario ? parsed.usuario : parsed;
    } catch (e) {
        return null;
    }
};

export const getCurrentToken = () => {
    return localStorage.getItem('token');
};


