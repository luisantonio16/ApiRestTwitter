//importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");


//importar clave secreta
const libjwt = require("../servicios/jwt");
const clave = libjwt.claveSecreta;




//funcion de autenticacion
exports.autenticar = (req, res, next) => {
     //comprobar la auth
     if (!req.headers.authorization) {
        return res.status(403).send({
            status:"Error",
            mensaje:"La peticion no tiene el token"
        })
     }

     //limpiar el token
     const token = req.headers.authorization.replace(/['']+/g,'');

     //decifrar el token
     try {
        const payload = jwt.decode(token, clave);

        //comprobar la exp del token
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                status:"Error",
                mensaje:"Token Expirado"
                
            })
        }

          //agregar datos de usuario a request
          req.usuario = payload
 
     } catch (error) {
        return res.status(404).send({
            status:"Error",
            mensaje:"Token Invalido",
            error
        })
     }

     //pasar a ejecuccion de accion
     next();

}
