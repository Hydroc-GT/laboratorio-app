const express = require('express');
const router = express.Router();
const analistaController = require('../controllers/analistaController');

router.get('/muestras/:idAnalista', analistaController.getMuestrasPorAnalista);
router.get('/parametros/:idMuestra', analistaController.getParametrosPorMuestra);
router.post('/resultados', analistaController.enviarResultados);
router.post('/validar-token', analistaController.validarToken);

module.exports = router;