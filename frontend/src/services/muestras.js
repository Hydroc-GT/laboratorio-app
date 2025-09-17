import axios from "axios";
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:3001/api";

// Función para crear una instancia de Axios con el header de usuario
const getAuthAxios = () => {
    const user = getCurrentUser();
    const config = {
        headers: {}
    };
    
    if (user && user.usuario) {
        config.headers['user-id'] = user.usuario.IdUsuario;
    }
    
    return axios.create(config);
};

// Funciones para el módulo de muestras
export const registrarMuestra = (muestra) => {
    return getAuthAxios().post(`${API_URL}/muestras/registrar`, muestra);
};

export const listarMuestras = () => {
    return getAuthAxios().get(`${API_URL}/muestras`);
};

// Funciones para el módulo de analista
export const getMuestrasPorAnalista = (idAnalista) => {
    return getAuthAxios().get(`${API_URL}/analista/muestras/${idAnalista}`);
};

export const getParametrosPorMuestra = (idMuestra) => {
    return getAuthAxios().get(`${API_URL}/analista/parametros/${idMuestra}`);
};

export const enviarResultados = (resultadosData) => {
    return getAuthAxios().post(`${API_URL}/analista/resultados`, resultadosData);
};

export const validarToken = (token) => {
    return getAuthAxios().post(`${API_URL}/analista/validar-token`, { token });
};

// Funciones para el módulo de validador
export const getDashboardValidador = () => {
    return getAuthAxios().get(`${API_URL}/validador/dashboard`);
};

export const asignarAnalista = (asignacionData) => {
    return getAuthAxios().post(`${API_URL}/validador/asignar-analista`, asignacionData);
};

export const aprobarMuestra = (idMuestra) => {
    return getAuthAxios().post(`${API_URL}/validador/aprobar`, { idMuestra });
};

export const desaprobarMuestra = (idMuestra, comentarios) => {
    return getAuthAxios().post(`${API_URL}/validador/desaprobar`, { idMuestra, comentarios });
};
