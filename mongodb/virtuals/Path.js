const Virtual = require("sools/executing/Virtual");
module.exports = class Path extends Virtual{
	constructor(value){
		super();
		this.value = value;
	}

	getProperty(propertyName){
		return new Path([this.value,propertyName].join("."))
	}

	getValue(scope){
		return this.value;
	}
}