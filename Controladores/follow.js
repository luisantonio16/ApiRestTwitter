const Follow = require("../modelos/follow");
const Usuario = require('../modelos/usuario');
const paginate = require('mongoose-paginate-v2');
const { populate } = require("../modelos/usuario");

const seguidoServicios = require("../servicios/seguidoUserId")

const pruebaFollow = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador Following"
    })
}

//accion de guardar o seguir
const guardarSeguir = (req, res)=>{
    //conseguir datos del body
    const params = req.body;

    //sacar id del usuario identificado
    let identificador = req.usuario;

    //crear un objeto del modelo follow
    let usuarioFollow = new Follow({
        usuario:identificador.id,
        seguido:params.seguido

    });

    usuarioFollow.save().then((follow) => {

        res.status(200).send({
            status:"Succes",
            mensaje:"Se guardo el seruidor",
            seguidor: follow
        })
        
        
    }).catch((err) => {
        return res.status(500).send({
            status:"error",
            mensaje:"Error al guardar el Seguidor"
        })
        
    });

}

//accion de dejar de seguir
const dejarSeguir = (req, res)=>{
    //conseguir datos del usuario identificado
    const userId = req.usuario.id;

    //conseguir id del usuario que sigo y quieroo dejar de seguir
    const seguido = req.params.id;


    //hacemos un find a la base de datos
    Follow.findOneAndRemove({usuario:userId, seguido:seguido}).then((follow) =>{  
        if(!follow){
            return res.status(404).send({
                status:"error",
                mensaje:"No hay ningun usuario con ese id"
            })
        } 

        return res.status(200).send({
            status:"Succes",
            mensaje:"Se dejo de seguir ",
            follow
        })

    }).catch((err) => {
        return res.status(500).send({
            status:"error",
            mensaje:"Error al dejar de seguir"
        })    
    });
}


//listado de usuario que esta siguiendo 
const siguiendo = (req, res)=>{
    //conseguir id del usuario identificado
    let userId = req.usuario.id;
    
    //comprobar si me llega el id por la URL
    if(req.params.id) userId = req.params.id;

    //comprobar que me lleguen la pagina por la url y si no la pagina es 1
    let page = 1
    if(req.params.page) page = req.params.page;

    //usuario por pagina que quiero mostrar
    const limit = 5;

    //find a los usuarios y usar la paginacion con mongoose
    Follow.paginate({usuario:userId},{ page, limit, populate:{path: "usuario seguido" , select:"-contraseña"}})
                                                                               .then(async (usuarios)=>{

        let seguidos = await seguidoServicios.seguidoUsuarioId(req.usuario.id);


        return res.status(200).send({
            status:"Succes",
            seguidos: seguidos.siguiendo,
            seguidores: seguidos.seguidores
        })

    }).catch((error)=>{
        return res.status(500).send({
            status:"error",
            mensaje:"Error mostrando los usuarios"
        })

    })
}


//listado de usuarios que siguen
const seguidores = (req, res)=>{
      //conseguir id del usuario identificado
      let userId = req.usuario.id;
    
      //comprobar si me llega el id por la URL
      if(req.params.id) userId = req.params.id;
  
      //comprobar que me lleguen la pagina por la url y si no la pagina es 1
      let page = 1
      if(req.params.page) page = req.params.page;
  
      //usuario por pagina que quiero mostrar
      const limit = 5;

      
        //find a los usuarios y usar la paginacion con mongoose
         Follow.paginate({seguido:userId},{ page, limit, populate:{path: "usuario seguido" , select:"-contraseña"}})
            .then(async (usuarios)=>{

            let seguidos = await seguidoServicios.seguidoUsuarioId(req.usuario.id);


            return res.status(200).send({
                status:"Succes",
                usuario:usuarios,
                seguidos: seguidos.siguiendo,
                seguidores: seguidos.seguidores
            })

            }).catch((error)=>{
                return res.status(500).send({
                status:"error",
                mensaje:"Error mostrando los usuarios"
            })

        })

   
}
module.exports = {
    pruebaFollow,
    guardarSeguir,
    dejarSeguir,
    siguiendo,
    seguidores

}