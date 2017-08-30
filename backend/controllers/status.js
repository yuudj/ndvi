const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/network', getNetworkData);

function getNetworkData(req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var serverNet = [];

        var ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;

            ifaces[ifname].forEach(function (iface) {
                serverNet.push(iface);
            });
        });

        res.status(200).json({
            client: ip,
            server: serverNet
        });
    } catch (error) {
        res.status(500).json(error);
    }

}
module.exports = router;