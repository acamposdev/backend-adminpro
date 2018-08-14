let express = require('express');
const fileUpload = require('express-fileupload');
let app = express();
let fs = require('fs');

// Modelos de MongoDB
let User = require('../models/user');
let Doctor = require('../models/doctor');
let Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:entity/:id', (req, res, next) => {
    
    let entity = req.params.entity;
    let id = req.params.id;

    // Validar tipos de entidad
    let allowedEntities = ['users', 'doctors', 'hospitals'];
    if (allowedEntities.indexOf(entity) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Entidad no valida',
            errors: { message: 'Las entidades validas deben ser ' + allowedEntities.join()}
        })
    }

    // Comprobamos que venga imagen
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No hay fichero seleccionado',
            errors: { message: 'Debe seleccionar una imagen' }
        })
    }

    // Obtener el nombre del fichero
    let file = req.files.image;
    let fileInArray = file.name.split('.');
    let extension = fileInArray[fileInArray.length -1];

    // Solo aceptamos determinadas extensiones
    var allowedExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    // Validacion por extension
    if (allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida',
            errors: { message: 'Los archivos validos deben ser ' + allowedExtensions.join()}
        })
    }

    // Nombre de archivo personalizado
    let fileName = `${id}-${(new Date()).getMilliseconds()}.${extension}`;

    // Mover el archivo del tmp a un path
    let path = `./uploads/${entity}/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover el fichero',
                errors: err
            });
        }

        uploadByType(entity, id, fileName, res);

        // res.status(200).json({
        //     ok: true,
        //     message: 'Archivo subido correctamente',
        //     extension: extension
        // });
    })

});

function uploadByType(entity, id, fileName, res) {

    if (entity === 'users') {
        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario no existe',
                    errors: { message: 'El usuario no existe' }
                });
            }

            let oldPath = './uploads/users/' + user.img;

            // Si existe se elimina
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = fileName;

            user.save( (err, userUpdated) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error actualizando usuario',
                        errors: err
                    });
                }

                userUpdated.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    user: userUpdated
                });
            });

        });
    }

    if (entity === 'doctors') {
        Doctor.findById(id, (err, doctor) => {

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    message: 'El medico no existe',
                    errors: { message: 'El medico no existe' }
                });
            }

            let oldPath = './uploads/doctors/' + doctor.img;

            // Si existe se elimina
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            doctor.img = fileName;

            doctor.save( (err, doctorUpdated) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error actualizando medico',
                        errors: err
                    });
                }
                
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de medico actualizada',
                    doctor: doctorUpdated
                });
            });

        });
    }

    if (entity === 'hospitals') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'El hospital no existe',
                    errors: { message: 'El hospital no existe' }
                });
            }

            let oldPath = './uploads/hospitals/' + hospital.img;

            // Si existe se elimina
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = fileName;

            hospital.save( (err, hospitalUpdated) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error actualizando hospital',
                        errors: err
                    });
                }
                
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: hospitalUpdated
                });
            });

        });
    }
}


module.exports = app;