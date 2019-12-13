const sools = require("sools");
const Model = require("./Model");
const ModelType = require("sools-data/ModelType");
const Properties = require("sools-define/Properties");
module.exports = sools.define(Model, (base) => {
    class User extends base {
    	toString(){
    		return this.email
    	}
    }

    return User;
}, [
	new ModelType('user'),
    new Properties({
    	email:Properties.types.string(),
    	password:Properties.types.string()
    })
])