const sools = require("sools");
const Model = require("sools/data/Model");
const Type = require("sools/data/Model/Type");
const Properties = require("sools/propertying/Properties");
module.exports = sools.define(Model, (base) => {
    class User extends base {
    	toString(){
    		return this.name;
    	}	
    }

    return User;
}, [
	new Type('user'),
    new Properties({
    	name:Properties.types.string(),
    })
])