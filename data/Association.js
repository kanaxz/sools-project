const sools = require("sools");
const NotImplemented = require("sools/errors/NotImplemented");
const Property = require("sools-define/Property");
class Association extends Property {
	constructor(params){
		super(params);
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