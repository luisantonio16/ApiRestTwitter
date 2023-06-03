const Usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt')
const jwt = require("../servicios/jwt")
const {paginate} = require('mongoose-paginate-v2')

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


const login =(req, res)=>{
    //recorrer parametros del body
    let params = req.body

    //buscar usuario en la base de datos si existe
    if (!params.email || !params.contraseña) {
        return res.status(500).json({
            status:"Error",
            mensaje:"Falta datos para Enviar."
        }) 
    }

     Usuario.findOne({ email: params.email}).exec().then(async function (usuario){
        if(usuario){
            //comprobar contraseña
            let verificar = await bcrypt.compare(params.contraseña, usuario.contraseña);

            if(!verificar){
                return res.status(404).json({
                    status:"Error",
                    mensaje:"No te has identificado correctamente"
                })
            }



            //devolver token
            const token = jwt.generarToken(usuario);


           //devolver datos de usuario
           return res.status(200).json({
            status:"Succes",
            mensaje:"estamos en el login",
            usuario:{
                id:usuario._id,
                nombre:usuario.nombre,
                usuario: usuario.usuario
            },
            token
            
          })

        }
    }).catch(function (error){
        return res.status(404).json({
            status:"Error",
            mensaje:"Error no se encontraron datos"
        })

    })
}

const perfilUsuario = (req, res)=>{
    //Recibir parametros
     const id = req.params.id;

     //consulta para sacar los datos del usuario
     Usuario.findById(id).select({contraseña:0, role:0}).exec().then(function (usuario){
        if(usuario){
            return res.status(200).json({
                status:"Succes",
                mensaje:"Usuario encntrado",
                Usuarios: usuario
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
    let pagina = 1;
    if(req.params.page){
        pagina = req.params.page
    }
    //convertir la pagina a entero
    pagina = parseInt(pagina);

    //hacer la paginacion con mongoose pagination
    const options = {
        pagina: pagina,
        limit: 10
      };

    //hacer la consulta
    await Usuario.paginate({} ,options, function(error, usuario){
        if(usuario){
            return res.status(200).json({
                status:"Succes",
                mensaje:"Lista de usuarios",
                Usuarios: usuario,
                total: usuario.totalDocs 

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

module.exports = {
    pruebaUser,
    registrarUsuario,
    login,
    perfilUsuario,
    listaUsuario
}