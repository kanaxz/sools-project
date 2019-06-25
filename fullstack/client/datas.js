const sools = require("sools");
const ModelInterfaces = require("sools-data/ModelInterfaces");
const models = require("./models");
const Stores = require("sools-data/storing/Stores");
const Query = require("sools-data/Query");
const RequestLauncher = require("sools-browser/RequestLauncher");
var modelInterfaces = new ModelInterfaces(models)
    .then(new RequestLauncher({
        url: '/datas',
        type: 'POST',
        source: (context) => {
            return {
                queries: context.getAll(Query)
            }
        }
    }))
    .then(function(context, next) {
        var xhr = context.get(XMLHttpRequest);
        var queries = context.getAll(Query);
        var results = JSON.parse(xhr.responseText);
        for (var i = 0; i < queries.length; i++) {
            queries[i].setResult(modelInterfaces, results[i])
        }
        return next();
    })

window.datas = modelInterfaces

module.exports = modelInterfaces;