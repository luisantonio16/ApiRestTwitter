const Follow = require("../modelos/follow")

const seguidoUsuarioId = async (usuarioIdentificado) =>{

    try 
    {
         let siguiendo = await Follow.find({usuario:usuarioIdentificado}).select({ _id:0, usuario:0, fechar:0 })
                                           .exec().then((seguido)=> seguido);


         let seguidores = await Follow.find({seguido:usuarioIdentificado}).select({ _id:0, seguido:0, fechar:0 })
         .exec().then((seguido)=> seguido);


         let siguiendoArrays = []

         siguiendo.forEach(Element=>{
            siguiendoArrays.push(Element.seguido)
         });

         let seguidoresArrays = []

         seguidores.forEach(Element=>{
            seguidoresArrays.push(Element.usuario)
         })


        return {
              siguiendo:siguiendoArrays,
              seguidores:seguidoresArrays
        }   
        
    } catch (error) {
        return {};
        
    } 

}


const seguidoresUsuario = async (usuarioIdentificado, seguidorId) =>{
    try 
    {
         let siguiendo = await Follow.findOne({usuario:usuarioIdentificado, seguido:seguidorId});

         let seguidores = await Follow.findOne({usuario:seguidorId, seguido:usuarioIdentificado});



        return {
              siguiendo,
              seguidores
        }   
        
    } catch (error) {
        return {};
        
    } 

}

module.exports = {
    seguidoUsuarioId,
    seguidoresUsuario
}