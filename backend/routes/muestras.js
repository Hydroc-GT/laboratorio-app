const express = require("express");
const router = express.Router();
const { registrarMuestra, listarMuestras } = require("../controllers/muestrasController");

router.post("/registrar", registrarMuestra);
router.get("/", listarMuestras);

module.exports = router;
