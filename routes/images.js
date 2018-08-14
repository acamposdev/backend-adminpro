let express = require('express');
let app = express();

const path = require('path');
const fs = require('fs');

/**
 * ruta para servir contenido estatico de imagenes
 */
app.get('/:entity/:img', (req, res, next) => {

    let entity = req.params.entity;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname , `../uploads/${entity}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendfile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendfile(pathNoImg);
    }

});

module.exports = app;