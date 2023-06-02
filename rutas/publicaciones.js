const express = require("express");
const router = express.Router();
const publicacionesControlador = require("../Controladores/publicacion");


router.get("/prueba-publicacion", publicacionesControlador.pruebaPublicacion);


module.exports = router