const Virtual = require("sools/executing/Virtual");
const MongoScope = require("../Scope")
module.exports = class Path extends Virtual{
	constructor(value){
		super();
		this.value = value;
	}

	getProperty(propertyName){
		return new Path([this.value,propertyName].join("."))
	}

	getValue(scope){
		if(!(scope instanceof MongoScope))
			throw new Error()
		return this.value;
	}
}