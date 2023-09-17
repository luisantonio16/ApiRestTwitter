const mongoose = require("mongoose");

const Conexion = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("Conectado!!!");
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    Conexion
}