const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const followSchema = Schema({
    usuario:{
        type:Schema.ObjectId,
        ref:"Usuario"
    },
    seguido:{
        type:Schema.ObjectId,
        ref:"Usuario"
    },
    fechar:{
        type:Date,
        default:Date.now
    }
})
followSchema.plugin(mongoosePaginate);
module.exports = model("follow",followSchema,"follows");