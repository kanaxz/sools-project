const expect = require("chai").expect;

const sools = require("sools");
const Mongo = require("sools-mongo/Process");
const ModelInterfaces = require("sools-data/ModelInterfaces");
const models = require("../shared/models");
const Context = require("sools-process/Context");

var modelInterfaces = new ModelInterfaces([models.user])
    .then(new Mongo('mongodb://localhost:27017', 'zenyo'))

modelInterfaces
    .setup(new Context())
    .then(() => {
        var start = new Date();
        return modelInterfaces.users.get().include("userGroups.group").then((users) => {
            console.log("users", users[0].userGroups[0], new Date() - start);
            return users;
        })
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        return modelInterfaces.stop(new Context())
    })