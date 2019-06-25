const sools = require("sools");
const Model = require("./Model");
const Properties = require("sools-define/Properties");
const ModelType = require("../ModelType");
module.exports = sools.define(Model, (base) => {
    class Group extends base {
    	toString(){
    		return this.name
    	}
    }

    return Group;
}, [
    new ModelType('group'),
    new Properties({
        name: Properties.types.string()
    })
])