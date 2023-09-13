const mongoose = require("mongoose");

const Conexion = async()=>{
    try {
        await mongoose.connect('mongodb+srv://luis16:luis1629@clontwitter.bjma8pe.mongodb.net/MiRedSocial');
        console.log("Conectado!!!");
        
    } catch (error) {
        console.log(error);
        throw new error("Nose pudo conectar a la base de datos");   
    }
}

module.exports = {
    Conexion
}