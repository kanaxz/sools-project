const Scope = require("sools/executing/Scope");
const Switch = require("./virtuals/SwitchExpression")

module.exports = class MongoScope extends Scope {

		constructor(query, isLookup){
			super();
			this._query = query;
			this.isLookup = isLookup;
		}

		get query(){
			return this._query || this.parent._query
		}

		child(query,isLookup){
			var child = new MongoScope(query,isLookup);
			child.parent = this;
			return child;
		}

		async process(scope){
			var result = await super.process(scope);
			var swtch
			if(result instanceof Switch)
				swtch = result
			else if(typeof(result) != "undefined")
				return result;
			else if(this.switch){
				swtch = this.switch;
				delete this.switch
			}
			if(swtch && typeof(swtch.$switch.default) == "undefined")
					swtch.$switch.default = null;
			return  swtch
		}
}