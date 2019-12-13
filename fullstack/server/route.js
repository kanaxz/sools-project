const sools = require("sools");
const datas = require("./datas");
const Builder = require("sools-process/Builder");
const Route = require("sools-express/Route");
const Request = require("sools-express/Request");
const Query = require("sools-data/Query");
const Response = require("sools-express/Response");
const express = require("./express");
var route = new Route(express, "/datas")
    .then(new Builder({
        source: (scope) => {
            var datas = scope.components.get(Request).body;
            return datas.queries
        },
        type: Query,
        isArray: true
    }))
    .then(datas)
    .then(new Response({
        source: (scope) => {
            var queries = scope.components.getAll(Query);

            var results = queries.map((query) => {
                return query.resultToJSON();
            })
            return results
        }
    }))
module.exports = route;