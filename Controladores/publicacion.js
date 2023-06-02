const pruebaPublicacion = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador Publicacion"
    })
}


module.exports = {
    pruebaPublicacion
}