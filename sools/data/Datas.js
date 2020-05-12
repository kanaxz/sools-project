const Env = require("../virtualizing/Env")
const VScope = require("../virtualizing/Scope")
const Virtualizing = require("../virtualizing");
const Flow =require("../processing/Flow")
const Model = require("./Model")
const HandlerOptions = require("../virtualizing/Handler/Options")
const Scope = require("../processing/Scope")
const Context = require("./Context");
const Virtuals = require("./virtualizing/Virtual/enum/")

module.exports = class Datas extends Flow {
 constructor(options) {
  super();
  this.init = options.init;
  this.models = options.models;
  this.source = options.source;
  this.executor = options.executor;
  var virtuals = Object.keys(this.models).reduce((result,modelName)=>{
  	result[modelName] = this.models[modelName].virtual
  	return result
  },{})
  this.env = new Env({
   	workers:options.virtualization,
	  types:{
	   ...virtuals,
	   ...Virtuals,
	   context:null
	  },
		initFn:($)=>{
		var datas = new this.vDatas(new HandlerOptions({
		 source:'datas',
		 scope:$._private
		}));
		var context = new this.context.virtual(new HandlerOptions({
		 source:'context',
		 scope:$._private
		}))
		}
  })
  var properties = {};
  for(let modelName in this.models){
   let model = this.models[modelName];
    properties[model.pluralName] = {
	  	type:Virtuals.collection.of(model.virtual)
	  }
  }
  this.vDatas = Virtualizing.defineType({
   name:'datas',
   extends:Virtuals.datas,
   properties
  })
 }

 async setup(scope, next) {
  this.context = Context;
  scope.datas = this;
  return super.setup(scope, next);
 }

 build(json){
	 return this.env.process((datas, context, $)=>{
	   this.init(datas, context,$)
	   var scope = $._private
	   this.env.build(scope,json)
	     
	 })
 }

 async execute(arg1,arg2){
  if(arg1 instanceof Context.type){
	  var vscope = this.env.process((datas, context, $)=>{
    this.init(datas, context,$)
    return arg2(datas,context,$)
	  })
	  
	  console.log(JSON.stringify(vscope,null," "));
	  var scope = new Scope();
	  scope.context = arg1
	  scope.scope = vscope;
	   await super.execute(scope,()=>{});    
	  return scope.result
  }
  else{
   return super.execute(arg1,arg2)
  }
 } 
}

