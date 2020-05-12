const Virtual = require("sools/executing/Virtual")
const MongoScope = require("./Scope")

function buildPath(...args){
	if(args.length == 1 && args[0] instanceof Array)
		return args[0].filter((s)=>s).join(".");
	else
		return args.filter((s)=>s).join(".");
}


module.exports = class Query extends Virtual {
	constructor(model, source,parent){
		super();	
		this.model = model;
		this.source = source;
		this.parent = parent;
		this.pipeline = [{
			$addFields:{
				id:'$_id'
			}
		}];
	}

	clone(){
		var clone = new Query(this.model,this.source,this);
		clone.pipeline = [...this.pipeline]
		return clone
	}

	get length(){
		
	}

 	attach(source){
 		this.source = source;
 	}

	async getValue(scope){
		if(scope instanceof MongoScope)
			return this;
		this.pipeline.push({
			$addFields:{
				_id:'$$REMOVE'
			}
		})
		debugger
		console.log(this.model,JSON.stringify(this.pipeline,null,' '))
		var collection = this.source.db.collection(this.model);
		var result;
		if(this.pipeline){
			result = await collection.aggregate(this.pipeline).toArray();
		}
		return result;
	}
}