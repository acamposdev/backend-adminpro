// Requires, importacion de librerias
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')

// Inicializamos variables
var app = express(); // Definicion del servidor express


// Body parser config
app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());


// Importar rutas
let appRoutes = require('./routes/app');
let userRoutes = require('./routes/user');
let loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, response) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos... \x1b[32m%s\x1b[0m', 'online');
    }
});


// Rutas
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escucha de peticiones
app.listen(3000, () => {
    console.log('Express server running on port 3000... \x1b[32m%s\x1b[0m', 'online');
});