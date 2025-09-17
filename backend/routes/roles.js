const express = require("express");
const router = express.Router();
const { crearRol, listarRoles } = require("../controllers/rolesController");

router.post("/", crearRol);
router.get("/", listarRoles);

module.exports = router;