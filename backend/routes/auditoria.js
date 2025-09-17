const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

// Obtener registros de auditoría (con filtros opcionales)
router.get('/logs', auditoriaController.obtenerRegistros);

// Registrar un evento de auditoría
router.post('/registrar', auditoriaController.registrarEvento);

module.exports = router;