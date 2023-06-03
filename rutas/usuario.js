const express = require("express");
const router = express.Router();
const UsuarioControlador = require("../Controladores/usuario");
const auth = require("../Midelware/auth")


router.get("/prueba-usuario", auth.autenticar, UsuarioControlador.pruebaUser);
router.post("/registrar", UsuarioControlador.registrarUsuario);
router.post("/login", UsuarioControlador.login);
router.get("/perfil/:id", auth.autenticar, UsuarioControlador.perfilUsuario);
router.get("/lista/:page?", auth.autenticar, UsuarioControlador.listaUsuario);


module.exports = router