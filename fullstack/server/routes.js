var path = require("path");
var stringUtilities = require("sools/string/utils")
var app = require("./express");

module.exports = function() {
    app.use("/apis/auth", require('./components/auth/route'));

    app.use('/storage/:path', (req, res) => {
        res.sendFile(app.get('storagePath') + '/' + req.params.path);
    })

    app.use('/assets/*', (req, res) => {
        var split = stringUtilities.splitAtFirst(req.originalUrl.substring(1), '/');
        var fileUrl = app.get('assetsPath') + '/' + split[1];
        res.sendFile(fileUrl);
    })

    app.use('/*', (req, res) => {
        res.sendFile(app.get('appPath') + '/index.html');
    });
}