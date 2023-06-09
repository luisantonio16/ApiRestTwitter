const express = require("express");
const router = express.Router();
const followControlador = require("../Controladores/follow");
const auth = require("../Midelware/auth")


router.get("/prueba-follow", followControlador.pruebaFollow);
router.post("/follow", auth.autenticar, followControlador.guardarSeguir);
router.delete("/delete-follow/:id", auth.autenticar, followControlador.dejarSeguir);
router.get("/siguiendo/:id?/:page?",auth.autenticar, followControlador.siguiendo);
router.get("/seguidores/:id?/:page?",auth.autenticar, followControlador.seguidores);


module.exports = router