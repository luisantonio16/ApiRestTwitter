const {Schema, model} = require("mongoose");


const usuarioSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido: String,
    contraseña:{
        type: String,
        required: true
    },
    usuario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "role_user"
    },
    imagen:{
        type: String,
        default: "default.png"
    },
    fechacreado:{
        type: Date,
        default: Date.now
    }
})

module.exports = model("Usuario",usuarioSchema,"Usuarios");