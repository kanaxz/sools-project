var config = require('./config')
const Scope = require("sools/processing/Scope");
var http = require("http");
const express = require("./express");
const route = require("./route");
const datas = require("./datas");
var routesConfig = require("./routes");
require('./passport');


route.setup(new Scope())
    .then(() => {
    	routesConfig();
        /**/
        var server = http.createServer(express);
        server.listen(config.express.port);
    })
