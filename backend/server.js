/*jshint node:true*/
'use strict';
const chalk = require('chalk');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const four0four = require('./utils/404')();
const environment = process.env.NODE_ENV;
const http = require('http');
const https = require('https');
const path = require('path');

var defaultSettings = path.join(__dirname, './settings.js');

/**
 * @description http/s server
 */
var server;
/** 
 * @description application settings
*/
var settings = require(defaultSettings);

settings.settingsFile = defaultSettings;

/**
 * @description data model
 */
require('./models/db');

/**
 *  @description passport autentication middleware
 */
var auth = require('./authentication');


/**
 *  @description mqtt broker
 */
var scheduler = require('./scheduler');

try {
    scheduler.init();
} catch (err) {
    console.error('ERROR AL SCHEDULER', err);
    process.exit(1);
}



// http authentication
if (settings.https) {
    server = https.createServer(settings.https, function (req, res) { app(req, res); });
} else {
    server = http.createServer(function (req, res) { app(req, res); });
}

server.setMaxListeners(0);

// user authentication
app.use('/', auth.isAuthenticated);

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger('dev'));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());


// Point static path to dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// API ROUTES
app.use('/api/plants', require('./controllers/plants'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/status', require('./controllers/status'));
app.use('/api', require('./routes'));


console.log('** BUILD **');
app.use(express.static('./dist/'));
// Any invalid calls for templateUrls are under app/* and should return 404
app.use('/app/*', function (req, res, next) {
    four0four.send404(req, res);
});

// Any deep link calls should return index.html
app.use('/*', express.static('./dist/index.html'));

// error de no authorizado
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({ 'message': err.name + ': ' + err.message });
  }
  else {
      console.error(err.stack);
      res.status(500).send('Algo no funciono bien!');
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}




server.listen(settings.uiPort, function () {

  if (settings.https) {
      console.log(chalk.bold(chalk.green('Express server listening on port https://localhost:' + settings.uiPort)));
  }
  else {
      console.log(chalk.bold(chalk.green('Express server listening on port http://localhost:' + settings.uiPort)));
  }

  console.log('env = ' + app.get('env') +
      '\n__dirname = ' + __dirname +
      '\nprocess.cwd = ' + process.cwd());
});


var dataInit = require('./dataInit');
dataInit.init();