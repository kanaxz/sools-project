const sools = require("sools");
const Control = require("../Control");
const Definition = require("../Definition");
const Scope = require("../render/Scope")
module.exports = sools.define(Control,(base)=>{
	class Root extends base {
	
		start(source){
			this.scope = new Scope(source);
			return this.initialize();
		}
	}

	return Root;
},[
	new Definition({
		name:'ui-root'
	})
])