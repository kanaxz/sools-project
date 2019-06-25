const sools = require("sools");
const Model = require("../Model");
const ModelType = require("../ModelType");
const Properties = require("sools-define/Properties");
module.exports = sools.mixin(Model, (base) => {
    class User extends base {
    	
    }

    return User;
}, [
	new ModelType('user'),
    new Properties({
    	firstname:Properties.types.string(),
    	lastname:Properties.types.string(),
    })
])