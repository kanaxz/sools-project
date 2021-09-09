const Virtual = require("../../executing/Virtual")

module.exports = class Collection extends Virtual{
	constructor(model){
		super();
		this.model = model;
		this.name = model.pluralName
	}
}