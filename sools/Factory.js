const sools = require("./sools");
class Factory {
	constructor(){
		this.dependencies = [];
	}

	build(base, ...args){
		var type = sools.define(base, this.dependencies,(tbase)=>{
			return class extends tbase{};
		});
		return new type(...args);
	}
}

module.exports = Factory;