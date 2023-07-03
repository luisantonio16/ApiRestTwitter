const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')


const usuarioSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido: String,
    biografia:String,
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

usuarioSchema.plugin(mongoosePaginate);
module.exports = model("Usuario",usuarioSchema,"Usuarios");