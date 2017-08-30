
const mongoose = require('mongoose');
const cron = require('node-cron');
const Plant = mongoose.model('Plants');
var tasks = [];


function init() {

    Plant
        .find()
        .exec(function (error, plants) {
            plants.forEach(function (plant) {
                schedulePlant(plant);
            }, this);
        });

}


function schedulePlant(plantDef) {
    if (plantDef._doc) {
        plantDef = plantDef._doc;
    }

    try {


        if (plantDef.schedule.isEnabled) {
            var task = cron.schedule(plantDef.schedule.cron, function () {
                try {
                    console.info('EJECUTANDO SCHEDULE PLANTA ' + plantDef._id);
                    execute(plantDef._id);
                }
                catch (error) {

                    console.error('EJECUTANDO SCHEDULE PLANTA ' + plantDef._id, error);
                }

            });

            task._id = plantDef._id;
            tasks.push(task);

        }
    } catch (error) {
        console.error('ERROR ECHDULING PLANT ID', plantDef._id);
    }

}

function execute(plant_id) {
    Plants
        .findOne({ _id: plant_id })
        .populate('cameras')
        .exec(function (error, plant) {
            plant.camera.forEach(function (plant) {
                // RUN MQTT COMMAND
            }, this);
        });
}

/**
 * deshabilita un elemento
 * @param {*} id identificador del elemento
 */
function unSchedulePlant(id) {
    var index = tasks.findIndex(function (entity) { return entity._id === id; });
    if (index >= 0) {
        var element = tasks.splice(index, 1);
        element[0].stop();
    }
}

function rebuild(){
    tasks.forEach(task=> task.stop());
    tasks=[];
    init();
}


module.exports.init = init;
module.exports.rebuild = rebuild;



