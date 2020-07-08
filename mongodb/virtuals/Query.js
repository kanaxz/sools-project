const Virtual = require("sools/executing/Virtual")
const MongoScope = require("../Scope")

function buildPath(...args){
	if(args.length == 1 && args[0] instanceof Array)
		return args[0].filter((s)=>s).join(".");
	else
		return args.filter((s)=>s).join(".");
}
var id = 0;

module.exports = class Query extends Virtual {
	constructor(collection,parent){
		super();	
		this.id = id++
		this.collection = collection;
		this.parent = parent;
		this.pipeline = []
	}

	clone(){
		var clone = new Query(this.collection,this);
		clone.pipeline = [...this.pipeline]
		return clone
	}

	async getValue(scope){
		if(scope instanceof MongoScope)
			return this;
		//console.log(this.collection.name,JSON.stringify(this.pipeline,null,' '))
		var collection = this.collection.source.db.collection(this.collection.name);
		var result;
		if(this.pipeline){
			result = await collection.aggregate(this.pipeline).toArray();
		}
		//console.log("result",JSON.stringify(result,null,' '))
		return result;
	}
}