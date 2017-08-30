const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Plants = mongoose.model('Plants');
const Images = mongoose.model('Images');
router.get('/', getAll);
//router.post('/', newElement);
router.put('/:id', updateElement);

router.get('/:id', getElement);
router.get('/:id/images/last', getLastImage);
router.get('/:id/images', getImages);

module.exports = router;
/**
 * Actualiza un elemento dentro del arbol de elementos
 * @param {*} req 
 * @param {*} res 
 */
function updateElement(req, res) {
  var Devices = mongoose.model('Devices');


  var query = { '_id': req.params.id };
  var newData = req.body.params;
  Devices.findOneAndUpdate(query, newData, { new: true, upsert: true }, function (err, doc) {
    if (err) {
      return res.send(500, { error: err });
    }
    return res.status(200).send(doc._doc);
  });
}


/**
 * Retorna los elmentos raiz del arbol de elementos
 * @param {*} req 
 * @param {*} res 
 */
function getAll(req, res) {

  Plants
    .find({})
    .sort('displayName')
    .exec(
    function (err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
}
/**
 * Retorna un elemento por ID
 * @param {*} req 
 * @param {*} res 
 */
function getElement(req, res) {
  Plants
    .findById(req.params.id)
    .exec(
    function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(data);
      }
    });
}
/**
 * Returns the las image of a plant
 * @param {*} req 
 * @param {*} res 
 */
function getLastImage(req, res) {
  Images
    .findOne({ plantId: new ObjectId(req.params.id) }, {}, { sort: { 'date': -1 } })
    .exec(
    function (err, data) {
      if (err) {
        res.status(500).send(err);
      }
      else if (!data) {
        res.status(404).send('No images for plant');
      }
      else {

        var img = new Buffer(data.data);
        res.writeHead(200, {
          'Content-Type': data.contentType,
          'Content-Length': img.length
        });
        res.end(img);
        
      }
    });

}

/**
 * Returns the las 24 images of a plant
 * @param {*} req 
 * @param {*} res 
 */
function getImages(req, res) {

  var page = isNaN(req.params.page)? 0 : req.params.page ;
  var pageSize=24;
  Images
    .find({ plantId: new ObjectId(req.params.id) }, {}, { sort: { 'date': -1 } })
    .skip(pageSize * page)
    .limit(pageSize)
    .exec(
    function (err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
}





