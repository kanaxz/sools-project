const sools = require("sools");
const Model = require("sools-data/Model");
const Properties = require("sools-define/Properties");
const Primary = require("sools-data/indexes/Primary");
const Unique = require("sools-data/indexes/Unique");
const Storable = require("sools-data/storing/Storable");
const ObjectIdProperty = require("sools-mongo/ObjectIdProperty");
module.exports = sools.define(Model, [Storable()], (base) => {
    class Model extends base {

    }

    return Model;
}, [
    new Primary('_id'),
    new Properties(new ObjectIdProperty({
        name: '_id'
    }))
])