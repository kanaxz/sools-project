const ExecutingHandler = require("sools/executing/Handler");
const mongo = require('mongodb');
const Datas = require("./virtuals/Datas")
const Handlers = require("./handlers")


module.exports = class Mongodb extends ExecutingHandler {

	constructor(options){
		super();
		this.options = options;
	}

	async setup(source){
		super.setup(source);
		this.client = await mongo.MongoClient.connect(this.options.url,{
      useUnifiedTopology:true
    })
    this.db = this.client.db(this.options.db);
    this.handlers = Handlers.map((Handler)=>new Handler(this))
	}

	init(scope,vscope){ 
		var datas = vscope.getVar('datas')
		scope.setValue(datas,new Datas(this,datas))
	}

	async processFunctionCall(scope, functionCall,args){
	
		for(var handler of this.handlers){
			var result = await handler.processFunctionCall(scope, functionCall,args);
			if(typeof(result) != "undefined")
				return result
		}
		return;
		
	}

	async stop(){
		await this.client.close();
	}
}