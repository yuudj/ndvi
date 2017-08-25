var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// begin schema
var userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isAdmin :{
        type: Boolean,
        required: true,
        default: false
    },
    permissions: {
      devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }]
    },
    hash: String,
    salt: String,
    timeCreated: { type: Date, default: Date.now },
});



userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, 'MY_SECRET'); // DO NOT KEEP YOUR SECRET IN THE CODE!
};



// registra el modelo en mongoose
mongoose.model('User', userSchema);
// end schema


init();


/** 
 * @description inicializa la coleccion de usuarios
*/
function init() {
    var User = mongoose.model('User');

   
    User.findOne({ login: 'admin' }, function (err, user) {
        if (!user){
            createAdmin();
        }
    });

    function createAdmin() {

        var user = new User();

        user.name = 'Built-in admin user';
        user.login = 'admin';
        user.isAdmin = true;

        user.setPassword('admin');

        user.save();
    }
}

// end init