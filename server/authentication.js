var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ login: username }, function (err, user) {
      if (err) { return callback(err); }
      // Return if user not found in database
      if (!user) {
        return callback(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return callback(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return callback(null, user._doc || user);
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });