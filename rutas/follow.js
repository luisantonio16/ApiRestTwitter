const express = require("express");
const router = express.Router();
const followControlador = require("../Controladores/follow");


router.get("/prueba-follow", followControlador.pruebaFollow);


module.exports = router