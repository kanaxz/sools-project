var config = require('./config')
const Scope = require("sools-process/Scope");
var http = require("http");
const express = require("./express");
const route = require("./route");
const datas = require("./datas");
var routesConfig = require("./routes");
require('./components/passport/setup');


route.setup(new Scope())
    .then(() => {
    	routesConfig();
        /**/
        var server = http.createServer(express);
        server.listen(config.express.port);
    })
