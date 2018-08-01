// Requires, importacion de librerias
let express = require('express');
let mongoose = require('mongoose');

// Inicializamos variables
var app = express(); // Definicion del servidor express


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, response) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos... \x1b[32m%s\x1b[0m', 'online');
    }
});


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});


// Escucha de peticiones
app.listen(3000, () => {
    console.log('Express server running on port 3000... \x1b[32m%s\x1b[0m', 'online');
});