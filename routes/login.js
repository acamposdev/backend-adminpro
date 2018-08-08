let express = require('express');
let app = express();

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

let User = require('../models/user');

/**
 * Metodo para logar usuarios
 */
app.post('/', (req, res) => {

    const body = req.body;

    User.findOne( { email: body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error buscando usuario por email',
                errors: err
            });
        }

        // Si el usuario existe
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email', // No especificar en PROD donde esta el error
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password', // No especificar en PROD donde esta el error
                errors: err
            });
        }

        // Ocultamos la password
        user.password = ':)';

        // Crear token de autenticacion
        let token = jwt.sign({
                user: user
            }, 
            SEED, 
            {
                expiresIn: 14400 // 4 horas
            });

        res.status(200).json({
            ok: true,
            user: user,
            token: token,
            id: user.id
        });
    });
});

module.exports = app;