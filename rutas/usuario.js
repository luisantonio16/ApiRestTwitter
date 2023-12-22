const express = require("express");
const router = express.Router();
const UsuarioControlador = require("../Controladores/usuario");
const auth = require("../Midelware/auth");
const  {upload} = require( "../firebase/firebaseStorage");





//rutas del controlador usuario
router.get("/prueba-usuario", auth.autenticar, UsuarioControlador.pruebaUser);
router.post("/registrar", UsuarioControlador.registrarUsuario);
router.post("/login", UsuarioControlador.login);
router.get("/perfil/:id", auth.autenticar, UsuarioControlador.perfilUsuario);
router.get("/lista/:page?", auth.autenticar, UsuarioControlador.listaUsuario);
router.put("/actualizar", auth.autenticar, UsuarioControlador.udapteUsuarios);
router.post("/subirarchivo",[auth.autenticar, upload.single("file0")],  UsuarioControlador.subirArchivo);
router.get("/avatar/:file",   UsuarioControlador.avatar);
router.get("/contar/:id?", auth.autenticar, UsuarioControlador.contar);

module.exports = router