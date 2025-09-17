const express = require("express");
const router = express.Router();
const { crearParametro, listarParametros, crearParametroNorma, listarParametrosPorNorma } = require("../controllers/parametrosController");

router.post("/", crearParametro);
router.get("/", listarParametros);

router.post("/norma", crearParametroNorma);
router.get("/norma/:idNorma", listarParametrosPorNorma);

module.exports = router;