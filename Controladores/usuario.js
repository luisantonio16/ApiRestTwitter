const Usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt')
const jwt = require("../servicios/jwt")
const paginate = require('mongoose-paginate-v2')
const fs = require("fs");
const path = require('path');
const seguidoServicios = require("../servicios/seguidoUserId")
const Siguiendo = require('../modelos/follow');
const publicacion = require('../modelos/publicacion');
const {  storage } = require('../firebase/firebaseStorage');
const { ref, uploadBytes} = require('firebase/storage');




const pruebaUser = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador usuarios",
        usuario: req.usuario
    })
}


const registrarUsuario = (req, res)=>{
    //recoger datos de usuario de la peticion
    let params = req.body
    // validar datos
    if(!params.nombre || !params.email || !params.contraseña || !params.usuario){
        return res.status(400).json({
            status:"Error",
            mensaje:"Faltan datos por enviar"
            
        })
    }
    //verificar si hay usuarios duplicados
    Usuario.find({
        $or:[
            {email:params.email.toLowerCase()},
            {usuario:params.usuario.toLowerCase()}
        ]
    }).exec().then(async function (usuario){
        if(usuario && usuario.length >=1){
            return res.status(200).send({
                status:"Succes",
                mensaje:"El usuario ya existe"     
            })
        } 
        else{
             //cifrar la contraseña
             let pdw = await bcrypt.hash(params.contraseña, 10);
             params.contraseña = pdw;

             //crear objeto de usuario
             let usuario = new Usuario(params);
             //guardar usuario en la base de datos
            usuario.save().then(function(user){
                return res.status(200).json({
                    status:"Succes",
                    mensaje:"Se agrego correctamente",
                    user
                })
            }).catch(function (error){
                if(error){
                    return res.status(500).json({
                        status:"Error",
                        mensaje:"Error Agregando usuarios"
                    })
                }
            })
        }
    }).catch(function (error){
        if(error){
            return res.status(500).json({
                status:"Error",
                mensaje:"Error verificando usuarios",
              

            })

        }
    })       
}

const login = (req, res)=>{
    let params = req.body;

    //buscar usuario en la base de datos si existe
    if (!params.email || !params.contraseña) {
        return res.status(500).send({
            status:"Error",
           mensaje:"Falta datos para Enviar."
       }) 
    }

    Usuario.findOne({email:params.email}).exec().then(async function(usuario){
        if(!usuario){
            return res.status(404).json({
                status:"error",
                mensaje:"Usuario no encontrado"
            })
        }

        let verificar = await bcrypt.compareSync(params.contraseña, usuario.contraseña);

        if(!verificar){
            return res.status(404).json({
                status:"Error",
                mensaje:"No te has identificado correctamente"
            })
        }

         const token = jwt.generarToken(usuario);

        //devolver datos de usuario
             return res.status(200).json({
                 status:"Succes",
                 mensaje:"Usuario Logueado",
                 usuario,
                 token
             })


    }).catch(function (error){
        return res.status(500).json({
            status:"Error",
            mensaje:"Error al buscar usuario"

        })
    })
}

const perfilUsuario = (req, res)=>{
    //Recibir parametros
     const id = req.params.id;

     //consulta para sacar los datos del usuario
     Usuario.findById(id).select({contraseña:0, role:0,}).exec().then( async function (usuario){

        const seguidosInfo = await seguidoServicios.seguidoresUsuario(req.usuario.id, id);

        if(usuario){
            return res.status(200).json({
                status:"Succes",
                mensaje:"Usuario encntrado",
                Usuarios: usuario,
                seguidos: seguidosInfo.siguiendo,
                seguidores: seguidosInfo.seguidores
            })

        }else{
            return res.status(404).json({
                status:"error",
                mensaje:"No se ecnontro usuario"
            })
        }

     })
}

const listaUsuario = async (req, res)=>{
    //recibir parametros por la url
    let id = req.usuario.id;
    let pagina = 1;
    if(req.params.page){
        pagina = req.params.page
    }
    //convertir la pagina a entero
    pagina = parseInt(pagina);
    const options = {
        page: pagina,
        limit: 5,
        collation: {
          locale: 'en',
        },
      };


    //hacer la consulta
    await Usuario.paginate({}, options).then(async function(usuario){
        if(usuario){

            const seguidosInfo = await seguidoServicios.seguidoUsuarioId(req.usuario.id);

            return res.status(200).json({
                status:"Succes",
                mensaje:"Lista de usuarios",
                Usuarios: usuario,
                totalUsuarios: usuario.totalDocs,
                pagina: usuario.page,
                totalpaginas:usuario.totalPages,
                seguidos: seguidosInfo.siguiendo,
                seguidores: seguidosInfo.seguidores
            })
        }
    }).catch(function(error){
        return res.status(404).json({
            status:"error",
            mensaje:"Error al consultar usuarios",
            error
        })
    })   
}

const udapteUsuarios =(req, res)=>{
    //recibir parametros por la url
    let usuarioId = req.usuario;
    let usuarioActualizar = req.body;

    //eliminamos los campo inecesarios
    delete usuarioId.exp;
    delete usuarioId.iat;
    delete usuarioId.imagen;
    delete usuarioId.role;

    //comprobamos si el usuario existe
    Usuario.find({
        $or:[
            {email:usuarioActualizar.email.toLowerCase()},
            {usuario:usuarioActualizar.usuario.toLowerCase()}
        ]
    }).exec().then(async function (usuario){

        let usuarioExiste = false

        usuario.forEach(user=>{
            if(user && user._id != usuarioId.id) usuarioExiste = true;
        })
        
        if(usuarioExiste){
            return res.status(200).send({
                status:"Succes",
                mensaje:"El usuario ya existe"     
            })
        } 

        //cifrar la contraseña
        if(usuarioActualizar.contraseña){
            let pdw = await bcrypt.hash(usuarioActualizar.contraseña, 10);
            usuarioActualizar.contraseña = pdw;
        }else{
            delete usuarioActualizar.contraseña;
        }
        
        //actualizar usuario
        Usuario.findByIdAndUpdate(usuarioId.id, usuarioActualizar, {new:true}).then(function(usuario){
            if(!usuario) return res.status(404).send({
                status:"Error",
                mensaje:"Error Actualizando Usuario"   
            })
            return res.status(200).send({
                status:"Succecs",
                mensaje:"Actualizo correctamente",
                usuario:usuario
            })


        })    
        
    }).catch(function (error){
        if(error){
            return res.status(500).json({
                status:"Error",
                mensaje:"Error verificando usuarios"          
            })
        }
    })      

   
}

const subirArchivo = (req, res) =>{

    //recojer el fichro de la imagen y comprobar si existe
    const file = req.file;
    if(!file){
        return res.status(400).json({
            status:"Error",
            mensaje:"No se ha subido ningun archivo",
        })
    }

    //recoger el nombre de la imagen
    const fileName = 'Avatar' + '-' + file.originalname;

    const storageRef = ref(storage, `Avatares/${fileName}`);

    uploadBytes(storageRef, fileName).then((snapshot) => {
        console.log('Uploaded a blob or file!'+ snapshot);
      });
   

    //comprabamos la extension de la imagen
   /*  if(extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "gif"){
        //borrar archivo subido
        const filepath = req.file.path
        const fileDelete = fs.unlinkSync(filepath);

        //devolver respuesta
        return res.status(400).send({
            status:"Error",
            mensaje:"Este archivo no se puede subir, intente con otro."
        })
    }

 */

        let id = req.usuario.id
        //guardamos la imagen en la base de datos
        Usuario.findOneAndUpdate({_id:id}, {imagen:publicUrl}, {new:true}).then(async function(usuario){
            if(!usuario){
                return res.status(500).send({
                    status:"Error",
                    mensaje:"No se pudo actualizar el avatar"
                })
            }
    
            res.status(200).send({
                status:"Succes",
                mensaje:"Archivo subido",
                usuario: usuario,
                publicUrl
            
            })
        })
  
  

}

const avatar = (req,res) =>{
    //sacar el parametro de la url
    const file = req.params.file;

    //montar un path real de la imagen
    const filepath = "./archivos/avatars/"+file;

    //comprbar si existe 
    fs.stat(filepath, (error, existe)=>{
        if(!existe){
            res.status(404).send({
                status:"Error",
                mensaje:"No se encontro la imagen",
            })
        }
        //deblvemos un file
        return res.sendFile(path.resolve(filepath))
    })
}

const contar = async (req,res)=>{
    let usuarioId = req.usuario.id;

    if(req.params.id) usuarioId = req.params.id;

    try {
        const siguiendo = await Siguiendo.count({usuario:usuarioId});

        const seguidores = await Siguiendo.count({seguido:usuarioId});

        const publicaciones = await publicacion.count({usuario:usuarioId});

        res.status(200).send({
            usuarioId,
            siguiendo:siguiendo,
            seguidores:seguidores,
            publicaciones:publicaciones
        })

    } catch (error) {
        res.status(404).send({
           status:"error",
           mensaje:"Error en el metodo de contar"
        })
        
    }
}
module.exports = {
    pruebaUser,
    registrarUsuario,
    perfilUsuario,
    listaUsuario,
    udapteUsuarios,
    login,
    subirArchivo,
    avatar, 
    contar
}