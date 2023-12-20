const express = require("express");
const router = express.Router();
const UsuarioControlador = require("../Controladores/usuario");
const auth = require("../Midelware/auth")
const multer = require("multer")

const app = express();
//configuramos el multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./achivos/avatars");

    },
    filename: function (req, file, cb) {
        cb(null, "Avatar"+ '-' + Date.now() + file.originalname)

    }
})



const subirarchivo = multer({storage})
app.use(express.static('archivos'));
//rutas del controlador usuario
router.get("/prueba-usuario", auth.autenticar, UsuarioControlador.pruebaUser);
router.post("/registrar", UsuarioControlador.registrarUsuario);
router.post("/login", UsuarioControlador.login);
router.get("/perfil/:id", auth.autenticar, UsuarioControlador.perfilUsuario);
router.get("/lista/:page?", auth.autenticar, UsuarioControlador.listaUsuario);
router.put("/actualizar", auth.autenticar, UsuarioControlador.udapteUsuarios);
router.post("/subirarchivo",[auth.autenticar, subirarchivo.single("file0")],  UsuarioControlador.subirArchivo);
router.get("/avatar/:file",   UsuarioControlador.avatar);
router.get("/contar/:id?", auth.autenticar, UsuarioControlador.contar);

module.exports = router