let express = require('express');
let app = express();

let Hospital = require('../models/hospital');
let Doctor = require('../models/doctor');
let User = require('../models/user');

/**
 * Busqueda general
 */
app.get('/all/:param', (req, res, next) => {

    let param = req.params.param;
    let regExp = new RegExp( param, 'i' );

    Promise.all( [
        searchHospital(param, regExp),
        searchDoctor(param, regExp),
        searchUsers(param, regExp)
    ]).then( responses => {
        res.status(200).json({
            ok: true,
            hospitals: responses[0],
            doctors: responses[1],
            users: responses[2]
        });
    });
});

/**
 * Busqueda por entidad
 */
app.get('/collection/:entity/:param', (req, res, next) => {

    let param = req.params.param;
    let entity = req.params.entity;
    let regExp = new RegExp( param, 'i' );
    let promise;

    switch(entity) {
        case 'user':
            promise = searchUsers(param, regExp);
            break;
        case 'doctor':
            promise = searchDoctor(param, regExp);
            break;
        case 'hospital':
            promise = searchHospital(param, regExp);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'tipo de busqueda no compatble',
                error: { message: 'Tipo de coleccion no valido' }
            });
    }

    promise.then( response => {
        res.status(200).json({
            ok: true,
            [entity]: response // La notacion [entity] permite parametrizar el nombre del atributo
        });
    });
});

/**
 * Metodo para buscar en hospitales con promesas
 */
function searchHospital(param, regExp) {

    return new Promise((resolve, reject) => {
        Hospital
            .find( { name: regExp })
            .populate( 'user', 'name email' )
            .populate( 'hospital' )
            .exec((err, result) => {
                if (err) {
                    reject('ERROR cargando hospitales ' , err);
                } else {
                    resolve(result);
                }
        });
    });
}

/**
 * Metodo para buscar en medicos con promesas
 */
function searchDoctor(param, regExp) {

    return new Promise((resolve, reject) => {
        Doctor
            .find( { name: regExp })
            .populate( 'user', 'name email' )
            .populate( 'hospital' )
            .exec((err, result) => {
                if (err) {
                    reject('ERROR cargando hospitales ' , err);
                } else {
                    resolve(result);
                }
            })
    })

}

/**
 * Metodo para buscar en usuarios con promesas
 */
function searchUsers(param, regExp) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([
                { 'name': regExp },
                { 'email': regExp }
            ])
            .exec( (err, users) => {
                if (err) {
                    reject('ERROR cargando usuarios ', err);
                } else {
                    resolve(users);
                }
            })
    })

}

module.exports = app;