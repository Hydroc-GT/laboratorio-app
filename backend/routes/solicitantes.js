const express = require("express");
const router = express.Router();
const { crearSolicitante, listarSolicitantes } = require("../controllers/solicitantesController");

router.post("/crear", crearSolicitante);
router.get("/listar", listarSolicitantes);

module.exports = router;