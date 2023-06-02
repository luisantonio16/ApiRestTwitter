const express = require("express");
const router = express.Router();
const UsuarioControlador = require("../Controladores/usuario");


router.get("/prueba-usuario", UsuarioControlador.pruebaUser);
router.post("/registrar", UsuarioControlador.registrarUsuario);


module.exports = router