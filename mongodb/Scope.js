const Scope = require("sools/executing/Scope");
const Query = require("./Query")
module.exports = class MongoScope extends Scope {

		constructor(query, isLookup){
			super();
			this._query = query;
			this.isLookup = isLookup;
		}

		get query(){
			return this._query || this.parent._query
		}

		async executeExecutable(executable){
			var queries = [this.query];
			if(this.isLookup)
				queries.push(this.parent.query);
			if(executable instanceof Query){
				var current = executable
				 while(current){
				 	if(queries.indexOf(current) != -1){
				 		return executable
				 	}
				 	current = current.parent;
				 }
			}	
			return super.executeExecutable(executable);
		}
}