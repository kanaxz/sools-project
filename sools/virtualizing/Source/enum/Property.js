const Source = require("../index")

module.exports = class Property extends Source {
	constructor(values){
		super();
		for(var p in values)
			this[p] = values[p];
	}

	toJSON(){
		if(this.source){
			var sourceJSON = this.source.toJSON();
			if(typeof(sourceJSON) == "string")
				return sourceJSON + "." +  this.path;
			return {
				source:sourceJSON,
				path:this.path
			}
		}
		else
			return "$" + this.path;
	}
}