const express = require("express");
const router = express.Router();
const UsuarioControlador = require("../Controladores/usuario");
const auth = require("../Midelware/auth");
const multer = require("multer");
const path = require('path');
const admin = require('firebase-admin')
const serviceAccount = require('../firebase/firebaseConfig')



const confing = serviceAccount;

// Configuración de Firebase
admin.initializeApp({
    credential: admin.credential.cert(confing),
    storageBucket: process.env.storageBucket, // Reemplaza con el ID de tu aplicación
});


const bucket = admin.storage().bucket();

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
//configuramos el multer para subir archivos
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./archivos/avatars");

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