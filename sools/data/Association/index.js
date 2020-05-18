const sools = require("../../sools");
const NotImplemented = require("../../errors/NotImplemented");
const Property = require("../../Propertiable/Property");
class Association extends Property {
	constructor(params){
		super(params);
        if(params)
		  this.onDelete = params.onDelete;
	}

    modelAttached(model, value) {

    }

    canBuild(object){
    	return object != null;
    }

    toJSON(){
    	return null;
    }
}

module.exports = Association;