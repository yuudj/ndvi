const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs');
const User = mongoose.model('User');
const Plants = mongoose.model('Plants');
const Images = mongoose.model('Images');


/**
 * Inicializa la base de datos
 */
function init() {

    initPlants();
}



/** 
 * @description inicializa la coleccion de Devices
*/
function initPlants() {


    Plants.count({}, function (err, count) {

        if (count > 0) {

            return;
        }
        console.log('DB: Inicializando coleccion de documentos');


        function createPLant(name, icon) {
            var plant = new Plants({
                icon: icon,
                displayName: name,
                schedule: {
                    isEnabled: true,
                    cron: '*/5 * * * *',
                    script: '../scripts/dummy.py'
                }
            });

            return plant.save(createImage);
        }



        function createImage(err, plant) {
            if (err)
                throw err;
            
            var image = new Images({
                plantId: plant._id,
                date:Date.now(),
                data: fs.readFileSync('./src/server/scripts/in.jpg'),
                contentType:'image/jpg'
            });
            image.save();
        }
        createPLant('Trigo', 'mdi:home-modern');
    });
}


exports.init = init;