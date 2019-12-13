const sools = require("sools");
const Mongo = require("sools-mongo/Process");
const ModelInterfaces = require("sools-data/ModelInterfaces");
const models = require("../shared/models");
const config = require("./config");

var datas = new ModelInterfaces(models)
    .then(new Mongo(config.mongo.url, config.mongo.db))

module.exports = datas;