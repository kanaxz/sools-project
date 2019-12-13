const sools = require("sools");
const Model = require("sools/data/Model");
const Type = require("sools/data/Model/Type");

module.exports = sools.define(Model, [
    new Type('membership')
])