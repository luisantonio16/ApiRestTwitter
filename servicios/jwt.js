const jwt  = require("jwt-simple")
const moment  = require("moment")

//clave secreta
const claveSecreta = "luis_1629"

//crear una fucion para generar tokens
const generarToken = (usuario)=> {
    const payload = {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        Usuario: usuario.Usuario,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()

    }
    return jwt.encode(payload, secreto);

}

module.exports = {
generarToken,
claveSecreta
}