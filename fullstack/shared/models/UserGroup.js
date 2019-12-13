const sools = require("sools");
const Model = require("./Model");
const ModelType = require("sools-data/ModelType");
module.exports = sools.define(Model, (base) => {
    class UserGroup extends base {

    }

    return UserGroup;
}, [
    new ModelType('userGroup'),
])