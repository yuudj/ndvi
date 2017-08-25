
const mongoose = require('mongoose');
const cron = require('node-cron');
var PythonShell = require('python-shell');
const Plant = mongoose.model('Plants');
var tasks = [];


function init() {
    Plant.find({}, function (err, plants) {
        if (err) {
            console.error('Error al inicializar plantas', err);
            return;
        }

        

        plants.forEach(function (plant) {
            schedulePlant(plant);
        }, this);

        console.info('Scheduler inicializado');
    });
}


function schedulePlant(plantDef) {
    try {
        if (plantDef._doc) {
            plantDef = plantDef._doc;
        }

        if (plantDef.schedule.isEnabled) {
            var task = cron.schedule(plantDef.schedule.cron, function () {
                try {
                    console.info('EJECUTANDO SCHEDULE PLANTA ' + plantDef._id);
                    executeScript(plantDef.schedule.script);
                }
                catch (error) {

                    console.error('EJECUTANDO SCHEDULE PLANTA ' + plantDef._id, error);
                }

            });

            task._id = plantDef._id;
            tasks.push(task);

        }
    } catch (error) {
        console.error('ERROR AL INICIALIZAR SCHEDULER');
    }

}

function executeScript(script) {
    PythonShell.run(script,{scriptPath: 'D:/WorkingFolder/TFS_CLOUD/FACU/ndvi/trunk/src/server/scripts'}, 
    function (err) {
        if (err) {
             console.error('EJECUTANDO SCRIPT ', err);
        }

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

/**
 * deshabilita un elemento
 * @param {*} id identificador del elemento
 */
function disable(id) {
    const Jobs = mongoose.model('Jobs');

    Jobs.update({ '_id': id }, {
        '$set': {
            'isEnabled': false
        }
    }, { new: true }, function (err, doc) {
        if (err) {
            throw err;
        }

        var index = tasks.findIndex(function (entity) { return entity._id === id; });

        if (index >= 0) {
            var element = tasks.splice(index, 1);
            element[0].stop();
        }
    });
}





module.exports.init = init;
module.exports.disable = disable;


