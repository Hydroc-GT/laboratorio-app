const express = require('express');
const router = express.Router();
const validadorController = require('../controllers/validadorController');

// Ruta para obtener todos los datos del dashboard del validador
router.get('/dashboard', validadorController.getDashboardData);

// Ruta para asignar un analista a una muestra
router.post('/asignar-analista', validadorController.asignarAnalista);

// Rutas para aprobar y desaprobar una muestra
router.post('/aprobar', validadorController.aprobarMuestra);
router.post('/desaprobar', validadorController.desaprobarMuestra);

module.exports = router;