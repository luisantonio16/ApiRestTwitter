const Usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt')

const pruebaUser = (req,res)=>{
    return res.status(200).send({
        mensaje:"Probando controlador usuarios"
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
                mensaje:"Error verificando usuarios"
            })

        }
    })       
}

module.exports = {
    pruebaUser,
    registrarUsuario
}