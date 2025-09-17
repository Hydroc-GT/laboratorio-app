const express = require("express");
const router = express.Router();
const { registrarResultado, listarResultadosPorMuestra } = require("../controllers/resultadosController");

router.post("/", registrarResultado);
router.get("/:idMuestra", listarResultadosPorMuestra);

module.exports = router;