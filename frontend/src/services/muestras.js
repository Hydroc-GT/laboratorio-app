import axios from "axios";

const API_URL = "http://localhost:3001/api/muestras";

export const registrarMuestra = (muestra) => axios.post(`${API_URL}/registrar`, muestra);
export const listarMuestras = () => axios.get(API_URL);
