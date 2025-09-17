const express = require("express");
const router = express.Router();
const { crearTipoMuestra, listarTiposMuestra } = require("../controllers/tiposMuestraController");

router.post("/", crearTipoMuestra);
router.get("/", listarTiposMuestra);

module.exports = router;