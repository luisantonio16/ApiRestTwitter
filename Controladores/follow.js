const pruebaFollow = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador Following"
    })
}


module.exports = {
    pruebaFollow
}