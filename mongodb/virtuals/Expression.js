const Virtual = require("sools/executing/Virtual");

module.exports = class Expression extends Virtual{
	constructor(values){
		super();
		if(!values)
			return
		for(var p in values)
			this[p] = values[p]
	}
}