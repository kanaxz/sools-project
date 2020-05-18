const sools = require("sools");
const Control = require("../Control");
const Definition = require("../Definition");
const Scope = require("../render/Scope")
module.exports = sools.define(Control,(base)=>{
	class Root extends base {
	
		async start(source){
			this.scope = new Scope(source);
			return await this.initialize();
		}
	}

	return Root;
},[
	new Definition({
		name:'ui-root'
	})
])