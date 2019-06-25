const sools = require("sools");
const Model = require("../Model");
const ModelType = require("../ModelType");
module.exports = sools.define(Model, (base) => {
    class Membership extends base {

    }

    return UserGroup;
}, [
    new ModelType('membership'),
])