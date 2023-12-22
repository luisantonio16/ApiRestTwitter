const express = require("express");
const router = express.Router();
const publicacionesControlador = require("../Controladores/publicacion");
const auth = require("../Midelware/auth")
const multer = require("multer");
const  {upload} = require( "../firebase/firebaseStorage.js");
/* 
const app = express();

//configuramos el multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./archivos/publicaciones")

    },
    filename: function (req, file, cb) {
        cb(null, "pub"+ '-' + Date.now() + file.originalname)

    }
})

const subirarchivo = multer({storage});
app.use(express.static('archivos')); */


router.get("/prueba-publicacion", publicacionesControlador.pruebaPublicacion);
router.post("/guardar",auth.autenticar ,publicacionesControlador.guardarPublicacion);
router.get("/publicaciones/:id",auth.autenticar, publicacionesControlador.sacarPublicacion);
router.delete("/eliminar/:id",auth.autenticar, publicacionesControlador.eliminarPublicacion);
router.get("/usuario/:id/:pagina?",auth.autenticar, publicacionesControlador.listarPublicacion);
router.post("/subirarchivo/:id",[auth.autenticar, upload.single("file0")], publicacionesControlador.subirArchivo);
router.get("/media/:file", publicacionesControlador.media);
router.get("/feed/:pagina?",auth.autenticar, publicacionesControlador.listadoFeed);


module.exports = router