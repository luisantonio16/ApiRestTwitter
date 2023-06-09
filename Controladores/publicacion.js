const Publicacion = require("../modelos/publicacion");
const { populate } = require("../modelos/usuario");
const usuario = require("../modelos/usuario");
const seguidoServicios = require("../servicios/seguidoUserId")
//importar modulos
const fs = require("fs");
const path = require('path');



const pruebaPublicacion = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador Publicacion"
    })
}

//guardar una publicacion
const guardarPublicacion= (req,res)=>{
    //recoger datos del body
    const params = req.body;

    //validamos los datos
    if(!params.texto){
        return res.status(400).send({
            status:"Error",
            message:"Faltan datos"
        })
    }

    //creamos un objeto
    let nuevaPublicacion = new Publicacion(params);
    nuevaPublicacion.usuario = req.usuario.id

    //guardamos la publicacion
    nuevaPublicacion.save().then((publicacion) => {
        res.status(200).send({
            status:"Succes",
            mensaje:"Guardando publicacion",
            publicacion:publicacion
        })
        
    }).catch((err) => {
        return res.status(400).send({
            status:"Error",
            message:"No se guardo la publicacion"
        })
        
    });
}

//sacar una publicacion
const sacarPublicacion = (req,res)=>{
    //recoger el id de la publicacion
    const publicacionId = req.params.id;

    //buscar la publicacion
    Publicacion.findById(publicacionId).then((publicacion) => {
        res.status(200).send({
            status:"Succes",
            mensaje:"Guardando publicacion",
            publicacion:publicacion
        })    
    }).catch((err) => {
        return res.status(400).send({
            status:"Error",
            message:"No se encontro la publicacion"
        })
    });

}

//eliminar una publicacin
const eliminarPublicacion = (req,res)=>{
    //recoger el id de la publicacion
    const publicacionId = req.params.id;

    //buscar y eliminar la publicacion
    Publicacion.findByIdAndRemove({usuario:req.usuario.id, _id:publicacionId}).then((publicacion) => {
        if(usuario){
            res.status(200).send({
                status:"Succes",
                mensaje:"Se elimino esta publicacion",
                publicacion:publicacion
            }) 
        }   
    }).catch((err) => {
        res.status(500).send({
            status:"Errr",
            mensaje:"No se pudo eliminar esta publicacion",
        }) 
        
    });
  
}

//listado de publicaciones de un usuario
const listarPublicacion = (req,res)=>{
       //recoger el id de la publicacion
       const publicacionId = req.params.id;

       let pagina = 1
       if(req.params.pagina) pagina= req.params.pagina;

       let limit = 5

       //hacemos la busqueda
       Publicacion.paginate({usuario:publicacionId}, { pagina, limit, populate:{path:"usuario", select:"-contraseña -role -email -__v"}}).then((publicacion) => {
            if(publicacion){ 
                res.status(200).send({
                    status:"Succes",
                    mensaje:"Publicaciones del usuario "+req.usuario.nombre,
                    publicaciones:publicacion,
                    total:publicacion.totalDocs,
                    pagina:publicacion.page,
                    totalPaginas:publicacion.totalPages
                }) 
            }  
       }).catch((err) => {
            res.status(500).send({
                status:"Errr",
                mensaje:"No se econtraron publicaciones",
            })  
       })
}

//subir archivos
const subirArchivo = (req,res)=>{
    //sacar id del parametro
    const publicacionId = req.params.id;


     //recojer el fichro de la imagen y comprobar si existe
     const archivo = req.file;
     if(!archivo){
         return res.status(400).json({
             status:"Error",
             mensaje:"No se ha subido ningun archivo",
         })
     }
 
     //recoger el nombre de la imagen
     const nombre = archivo.originalname;
     //sacamos la extencion del archivo
     const nombreSplit = nombre.split("\.");
 
     const extencion = nombreSplit[1]
     //comprabamos la extension de la imagen
     if(extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "gif"){
         //borrar archivoo subbido
         const filepath = req.file.path
         const fileDelete = fs.unlinkSync(filepath);
 
         //devolver respuesta
         return res.status(400).send({
             status:"Error",
             mensaje:"Este archivo no se puede subir, intente con otro."
         })
     }
 
 
     //sacams el id del inicio de seccion
     let id = req.usuario.id
     //guardamos la imagen en la base de datos
     Publicacion.findOneAndUpdate({usuario:id, _id:publicacionId}, { archivo:req.file.filename}, {new:true}).then(function(publicacion){
         
         if(!usuario){
             return res.status(500).send({
                 status:"Error",
                 mensaje:"No se pudo actualizar el avatar"
             })
         }
 
         res.status(200).send({
             status:"Succes",
             mensaje:"Archivo subido",
             publicacion: publicacion,
             files: req.file
         })
     })
}

//subir media
const media = (req,res) =>{
    //sacar el parametro de la url
    const file = req.params.file;

    //montar un path real de la imagen
    const filepath = "./archivos/publicaciones/"+file;

    //comprbar si existe 
    fs.stat(filepath, (error, existe)=>{
        if(!existe){
            res.status(404).send({
                status:"Error",
                mensaje:"No se encontro la imagen"
            })
        }
        //deblvemos un file
        return res.sendFile(path.resolve(filepath))
    })
}

//listado de publicaciones para el Feed
const listadoFeed = async (req, res)=>{
    //sacar la pagina actual
    let pagina = 1
    if(req.params.pagina) pagina= req.params.pagina;

    //numero maximo de paginas
    let limit = 5
   

    try {

         //sacar un arrays de indetificadores de los usuarios que yo sigo
        const siguiendo = await seguidoServicios.seguidoUsuarioId(req.usuario.id);

        //hacemos un find de las publicaciones
       const publicaciones = await Publicacion.paginate({usuario:siguiendo.siguiendo}, { pagina, limit, sort: { fechaCreado: -1 } ,populate:{path:"usuario", select:"-contraseña -role -email -__v"}})

       if(publicaciones){
            res.status(200).send({
                status:"Suuces",
                mensaje:"feed de las publicaciones",
                siguiendo:siguiendo.siguiendo,
                publicaciones
            })
       }
     
        
    } catch (error) {
        res.status(500).send({
            status:"Error",
            mensaje:"Error Mostrando las publicaciones"
        })
    }
    
}



module.exports = {
    pruebaPublicacion,
    guardarPublicacion,
    sacarPublicacion,
    eliminarPublicacion,
    listarPublicacion,
    subirArchivo,
    media,
    listadoFeed
}