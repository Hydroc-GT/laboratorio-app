const express = require("express");
const router = express.Router();
const { crearNorma, listarNormas } = require("../controllers/normasController");

router.post("/", crearNorma);
router.get("/", listarNormas);

module.exports = router;