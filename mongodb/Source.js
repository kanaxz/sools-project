const ExecutingHandler = require("sools/executing/Handler");
const mongo = require('mongodb');
const Datas = require("./virtuals/Datas")
const Handlers = require("./handlers")
const Virtuals = require("sools/data/virtualizing/Virtual/enum")

module.exports = class Mongodb extends ExecutingHandler {

	constructor(options){
		super();
		this.options = options;
	}

	async setup(source){
		await super.setup(source);
		this.client = await mongo.MongoClient.connect(this.options.url,{
      useUnifiedTopology:true
    })
		this.db = this.client.db(this.options.db);
 		this.handlers = Handlers.map((Handler)=>new Handler(this))
 		for(var modelName in this.source.datas.models){
 			var model = this.source.datas.models[modelName]
 			if(model.virtual instanceof Virtuals.model)
 				await this.db.createCollection(model.pluralName);
 		}
	}

	async init(scope,vscope){ 
		var context = await scope.getValue(vscope.getVar('context'))
		context.db = new Datas(this,this.source.datas);
	}

	async processFunctionCall(scope, functionCall,next){
	
		for(var handler of this.handlers){
			var result = await handler.processFunctionCall(scope, functionCall);
			if(typeof(result) != "undefined")
				return result
		}
		return next();
		
	}

	async stop(){
		await this.client.close();
	}
}