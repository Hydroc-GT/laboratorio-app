const express = require("express");
const router = express.Router();
const { crearUsuario, listarUsuarios, loginUsuario } = require("../controllers/usersController");
const { actualizarEstadoUsuario } = require("../controllers/usersController");

// Cambia "/crear" por "/register" para que coincida con el frontend
router.post("/register", crearUsuario); 
router.get("/listar", listarUsuarios);
router.post("/login", loginUsuario);
router.put("/estado/:idUsuario", actualizarEstadoUsuario);

module.exports = router;
