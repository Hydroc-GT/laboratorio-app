const express = require("express");
const router = express.Router();
const { registrarMuestra, listarMuestras, obtenerUltimoCodigo, obtenerSiguienteNumero } = require("../controllers/muestrasController");
router.post("/registrar", registrarMuestra);
router.get("/", listarMuestras);
router.get("/siguiente-numero", obtenerSiguienteNumero);
router.get("/ultimo-codigo", obtenerUltimoCodigo);

module.exports = router;
