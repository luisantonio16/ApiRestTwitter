const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const publicacionSchema = Schema({
    usuario:{
        type:Schema.ObjectId,
        ref:"Usuario"
    },
    texto:{
        type:String,
        require:true
    },
    archivo:{
        type: String,
    },
    fechaCreado:{
        type:Date,
        default:Date.now
    }
})
publicacionSchema.plugin(mongoosePaginate);
module.exports = model("publicacion",publicacionSchema,"publicacions");