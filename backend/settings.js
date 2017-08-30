// The `https` setting requires the `fs` module. Uncomment the following
// to make it available:
const fs = require('fs');
const path = require('path');
module.exports = {
    // the tcp port that the web server is listening on.
    uiPort: process.env.PORT || 8003,

    frontEnd: path.join(__dirname, '../frontend/dist'),
    // By default, the app will accepts connections on all IPv4 interfaces.
    // The following property can be used to listen on a specific interface. For
    // example, the following would only allow connections from the local machine.
    //uiHost: "127.0.0.1",
    mqttClient: {
        // Retry time in milliseconds for MQTT connections
        reconnectTime: 15000
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
