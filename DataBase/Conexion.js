const mongoose = require("mongoose");

const Conexion = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/MiRedSocial');
        console.log("Conectado!!!");
        
    } catch (error) {
        console.log(error);
        throw new error("Nose pudo conectar a la base de datos");   
    }
}

module.exports = {
    Conexion
}