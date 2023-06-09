const jwt  = require("jwt-simple")
const moment  = require("moment")

//clave secreta
const claveSecreta = "luis_1629"

//crear una fucion para generar tokens
const generarToken = (Usuario)=> {
    const payload = {
        id: Usuario.id,
        nombre: Usuario.nombre,
        apellido: Usuario.apellido,
        usuario: Usuario.usuario,
        email: Usuario.email,
        role: Usuario.role,
        imagen: Usuario.imagen,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix(),

    }
    return jwt.encode(payload, claveSecreta);

}

module.exports = {
generarToken,
claveSecreta
}