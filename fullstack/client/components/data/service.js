const datas = require("../../datas")
const controls = require("../../../shared/controls")
const Virtuals = require("sools/data/virtualizing/Virtual/enum");
const HandlerOptions = require("sools/virtualizing/Handler/Options")
const Sources = require("sools/virtualizing/Source/enum")
const Memory = require("sools/executing/Memory")
const handlers = require("./handlers")
var service = {
	source:new Memory({
		handlers:[
			...handlers.map((h)=>new h())
		]
	}),
  async init() {
  	var scope = new Scope();
  	scope.datas = datas;
  	await this.source.setup(scope,()=>{});
    this.controls = {}
    for (var modelName in datas.models) {
    	var model = datas.models[modelName]
    	if(!(model.virtual.prototype instanceof Virtuals.model))
    		continue
    	if(!controls[modelName])
    		continue
    	if(modelName != "ressource")
    		continue
      this.controls[modelName] = {
        add:controls[modelName].add && datas.process((context,$) => {
        	var models = new (Virtuals.array.of(model.virtual))(new HandlerOptions({
        		scope:$._private,
        		source:new Sources.var("models")
        	}));
        	var type = new Virtuals.string(new HandlerOptions({
        		scope:$._private,
        		source:new Sources.var('type')
        	}))
        	return controls[modelName].add(context,models,$)
        })
      }
    }
    console.log(this)
  },
  async form(type,model,values,options){
  	var scope = new Scope();
  	scope.scope = this.controls[model.name][type];
  	scope.vars = {
  		context:new datas.buildContext(),
  		models:[new Model(values,options)],
  		type
  	}
  	var result = await this.source.execute(scope,()=>{});
  }
}

module.exports = service;