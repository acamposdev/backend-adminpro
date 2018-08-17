let express = require('express');
let app = express();

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// GOOGLE
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Model de mongoDB
let User = require('../models/user');

// Autenticacaion de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


/**
 * Metodo para logar usuarios JWT
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
        let token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            user: user,
            token: token,
            id: user.id
        });
    });
});

/**
 * Autenticacion con GOOGLE
 */
app.post('/google', async (req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'Token no valido'
            })
        });

    User.findOne({
        email: googleUser.email
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (user) {
            if (user.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe usar su autenticacion normal',
                });
            } else {
                // Crear token de autenticacion
                let token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

                return res.status(200).json({
                    ok: true,
                    user: user,
                    token: token,
                    id: user.id
                });
            }
        } else {
            // El usuario no existe y hay que crearlo
            var user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.password = ':)';
            user.google = true;

            user.save((err, userSaved) => {
                // Crear token de autenticacion
                let token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 horas

                console.log('userSaved ' , userSaved)

                res.status(200).json({
                    ok: true,
                    user: userSaved,
                    token: token,
                    id: userSaved.id
                });
            });
        }
    });
})

module.exports = app;