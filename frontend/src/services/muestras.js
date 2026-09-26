import api from './api';

// Módulo de Muestras
export const registrarMuestra = (muestra) => {
    return api.post('/muestras/registrar', muestra);
};

export const listarMuestras = (solicitanteId = null) => {
    const url = solicitanteId ? `/muestras?solicitanteId=${solicitanteId}` : '/muestras';
    return api.get(url);
};

export const getSiguienteNumeroMuestra = (idTipoMuestra) => {
    return api.get(`/muestras/siguiente-numero?idTipoMuestra=${idTipoMuestra}`);
};

export const getUltimoCodigoMuestra = (tipo) => {
    return api.get(`/muestras/ultimo-codigo?tipo=${encodeURIComponent(tipo)}`);
};

// Módulo de Solicitantes
export const listarSolicitantes = () => {
    return api.get('/solicitantes/listar');
};

export const registrarSolicitante = (solicitanteData) => {
    return api.post('/solicitantes/registrar', solicitanteData);
};

// Módulo de Analista
export const getMuestrasPorAnalista = (idAnalista) => {
    return api.get(`/analista/muestras/${idAnalista}`);
};

export const getParametrosPorMuestra = (idMuestra) => {
    return api.get(`/analista/parametros/${idMuestra}`);
};

export const enviarResultados = (resultadosData) => {
    return api.post('/analista/resultados', resultadosData);
};

export const validarTokenQR = (token) => {
    return api.post('/analista/validar-token', { token });
};

// Módulo de Validador
export const getDashboardValidador = () => {
    return api.get('/validador/dashboard');
};

export const asignarAnalista = (asignacionData) => {
    return api.post('/validador/asignar-analista', asignacionData);
};

export const aprobarMuestra = (idMuestra) => {
    return api.post('/validador/aprobar', { idMuestra });
};

export const desaprobarMuestra = (idMuestra, comentarios) => {
    return api.post('/validador/desaprobar', { idMuestra, comentarios });
};

