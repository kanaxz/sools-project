const vutils = require("sools/virtualizing/utils");
const MongoScope = require("./Scope");
const RootPath = require("./virtuals/RootPath")
const Sources = require("sools/virtualizing/Source/enum")

module.exports = {
	...vutils,
	childScope:function(scope, query, isLookup){
		var child = new MongoScope(query,isLookup);
		child.parent = scope;
		return child;
	},
	getRoot:async function (scope, handler){
		var path = []
		var root;
		var query;
		async function check(){
			if(handler.source instanceof Sources.var){

				var rootPath = await scope.getValue(handler,RootPath);
				if(!(rootPath instanceof RootPath)){
					debugger
					throw new Error("No pair found")
				}
				if(rootPath.value != "")
					path.unshift(rootPath.rootValue);
				root = handler;
				query = rootPath.query;
				return false;
			}
			else
				return true;
		}
		while(await check()){
			if(handler.source instanceof Sources.property){
				path.unshift(handler.source.path)
				handler = handler.source.source;
			}
			else{			
				throw new Error()
			}
		}

		return {
			handler:root,
			path:path.join("."),
			query
		}
	}
}