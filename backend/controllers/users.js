const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const os = require('os');

router.get('/', getAll);
router.post('/', create);
router.put('/:login/changePass', changePass);
router.put('/:login', change);
router.get('/current', current);
router.get('/:login', get);
router.delete('/:login', del);

/**
 * Retorna todos los usuario
 * @param {*} req 
 * @param {*} res 
 */
function getAll(req, res) {
  User
    .find({})
    .exec(function (err, data) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(data.map(function (user) {
          return hideSensitiveData(user._doc);
        }));
      }
    });
}
/**
 * Retorna un usuario
 * @param {*} req 
 * @param {*} res 
 */
function get(req, res) {
  User
    .findOne({ login: req.params.login.toLowerCase() })
    .populate('permissions.devices._id')
    .exec(function (err, data) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(hideSensitiveData(data._doc));
      }
    });
}

/**
 * Elimina un usuario
 * @param {*} req 
 * @param {*} res 
 */
function del(req, res) {
  User
    .findOne({ login: req.params.login.toLowerCase() })
    .remove()
    .exec(function (err, data) {
      if (err) {
        res.status(500).json(err);
      }
      else {

        res.status(200);
      }
    });
}

/**
 * Cambiael password de un usuario
 * @param {*} req 
 * @param {*} res 
 */
function changePass(req, res) {
  User
    .findOne({ login: req.params.login.toLowerCase() })
    .exec(function (err, user) {
      if (err) {
        res.status(500).json(err);
      }

      else {
        if (user) {
          user.setPassword(req.body.password);
          user.save();
        }

        res.status(200);
      }
    });
}



/**
 * Retorna el usuario actual
 * @param {*} req 
 * @param {*} res 
 */
function current(req, res) {

  if (req.user) {
    res.status(200).json(hideSensitiveData(req.user));

  }
  else {
    return res.status(401).send({
      message: 'User not authenticated'
    });

  }

}

/**
 * Crea un usuario
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
  var user = new User();

  user.name = req.body.name;
  user.login = req.body.login.toLowerCase();
  user.isAdmin = req.body.isAdmin;
  //user.timeCreated= Date.now;
  if (!user.isAdmin) {
    req.body.permissions.devices.forEach(function (element) {
      user.permissions.devices.push(mongoose.Types.ObjectId(element));
    }, this);

  }


  user.setPassword(req.body.password);

  user.save(function (err, data) {
    if (err) {
      res.status(500).json(err);
    }
    else {
      res.status(200).json(data);
    }

  });

}

/**
 * Cambia el nombre y los pemisos de un usuario
 * @param {*} req 
 * @param {*} res 
 */
function change(req, res) {
  User
    .findOne({ login: req.params.login.toLowerCase() })
    .exec(function (err, user) {
      if (err) {
        res.status(500).json(err);
      }

      else {
        if (user) {
          user.permissions.devices = req.body.permissions.devices;
          user.name = req.body.name || user.name;
          user.save();
        }

        res.status(200);
      }
    });
}

/**
 * Cambia un password
 * @param {*} req 
 * @param {*} res 
 */
function changePassword(req, res) {

  User
    .findById(req.params.login)
    .exec(function (err, data) {
      if (err) {
        res.status(500).json(err);
      } else if (!data) {
        res.status(404).send('Usert not found');
      }
      else {
        data.setPassword(req.body.password);
      }
    });


}


/**
 * Crea un usuario
 * @param {*} req 
 * @param {*} res 
 */
function changeMyPassword(req, res) {

  User
    .findOne({ login: req.login.toLowerCase() })
    .exec(function (err, data) {
      if (err) {
        res.status(500).json(err);
      } else if (!data) {
        res.status(401).send('Nt autorized');
      }
      else {
        data.setPassword(req.body.password);
      }
    });


}

function hideSensitiveData(user) {
  if (!user) {
    return user;
  }

  var obj = user;

  if (obj.hasOwnProperty('__v')) {
    delete obj.__v;
  }
  if (obj.hasOwnProperty('salt')) {
    delete obj.salt;
  }

  if (obj.hasOwnProperty('hash')) {
    delete obj.hash;
  }


  return obj;
}

module.exports = router;