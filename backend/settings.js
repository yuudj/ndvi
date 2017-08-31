// The `https` setting requires the `fs` module. Uncomment the following
// to make it available:
const fs = require('fs');
const path = require('path');
module.exports = {
    // the tcp port that the web server is listening on.
    uiPort: process.env.PORT || 8003,

    frontEnd: path.join(__dirname, '../frontend/dist'),
    //MQTT CLIENT OPTIONS https://www.npmjs.com/package/mqtt#client
    mqttClient: {
        // Retry time in milliseconds for MQTT connections
        host : '',
        options
        //auth:{user:'', pass:''}
    },

    // The following property can be used to enable HTTPS
    // See http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
    // for details on its contents.
    // See the comment at the top of this file on how to load the `fs` module used by
    // this setting.
    //
    https: {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
    },
    mongo: {
        dbURI: process.env.MONGOLAB_URI || 'mongodb://localhost/NDVI',
        dbAuth : {
            useMongoClient: true,
            //user: dbUser,
            //pass: dbPass
        }
    }


};
