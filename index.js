const {Conexion} = require('./DataBase/Conexion');
const express = require("express");
const cors = require("cors");
//Bienvenido
console.log('Bienvenido al proyecto Node Express MongoDB');

//conexion a base de datos
Conexion();

//crear servidor node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());

//convertir los datos del body a obj json
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar rutas
const userRouter = require("./rutas/usuario")
const publicacionRouter = require("./rutas/publicaciones")
const followRouter = require("./rutas/follow")

app.use("/api/usuarios", userRouter)
app.use("/api/publicacion", publicacionRouter)
app.use("/api/follow", followRouter)

//rutas de pruebas
app.get("/prueba1", (req, res)=> {
    return res.status(200).json(
        {
            id:'1',
            nombre:'Luis',
            apellido:'salazar'
        }
    )
})

//cargar el servidor con peticciones ajax
app.listen(puerto, () => {
    console.log('Corriendo');

})
