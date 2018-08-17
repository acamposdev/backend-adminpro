// Requires, importacion de librerias
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')

// Inicializamos variables
var app = express(); // Definicion del servidor express

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow_Methods", "POST", "PUT", "GET", "DELETE", "OPTIONS");
    next();
});

// Body parser config
app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());


// Importar rutas
let appRoutes = require('./routes/app');
let userRoutes = require('./routes/user');
let hospitalRoutes = require('./routes/hospital');
let doctorRoutes = require('./routes/doctor');
let loginRoutes = require('./routes/login');
let searchRoutes = require('./routes/search');
let uploadRoutes = require('./routes/upload');
let imagesRoutes = require('./routes/images');

// Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true }, (err, response) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos... \x1b[32m%s\x1b[0m', 'online');
    }
});

// serve-index config
// Permite ver el contenido estatico del servidor
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/users', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/', appRoutes);

// Escucha de peticiones
app.listen(3000, () => {
    console.log('Express server running on port 3000... \x1b[32m%s\x1b[0m', 'online');
});