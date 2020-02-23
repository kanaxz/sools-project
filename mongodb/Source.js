const ExecutingHandler = require("sools/executing/Handler");
const VScope =  require("sools/virtualizing/Scope");
const Statment = require("sools/virtualizing/Statment");
const Env = require("sools/virtualizing/Env");
const mongo = require('mongodb');
const Handler = require("sools/virtualizing/Handler")
const utils = require("./utils");
const Path = require("sools/executing/Path");
const Functions = require("sools/virtualizing/Function/enum");
const Source = require("sools/virtualizing/Source")
const Sources = require("sools/virtualizing/Source/enum")
const Virtual = require("sools/virtualizing/Virtual");
const Virtuals = require("sools/data/virtualizing/Virtual/enum")

class MemoryArray extends Path{
	constructor(name,array){
		super(name);
		this.array = array;
	}
}

var exprTypeHandlers = {
	async handle(scope, mongoQuery, functionCall){
		return await this[functionCall.function.type.typeName].handle(scope, mongoQuery, functionCall);
	},
	base:{
		async handle(scope, mongoQuery, functionCall){
			var result = [];
			for(var arg of functionCall.args)
				result.push(await buildExprArg(scope,mongoQuery,arg))
			return {
				["$" + functionCall.function.name] : result
			}
		}
	},
	array:{
		async handle(scope, mongoQuery, functionCall){
			var source = await scope.getValue(functionCall.args[0])
			var object = functionCall.args[1].args[0]
			var child = scope.child()
			if(typeof(source) == "string"){
				child.setSource(object, new Path("$$" + object.source.name))
				return this[functionCall.function.name](child, mongoQuery, source, functionCall)
			}
			else{
				var memoryArrayId = utils.gererateVariableId();
				child.setSource(object, new MemoryArray("$$" + object.source.name,source))
				if(source instanceof HasMany)
					source = source.content;
				return {
					$let:{
						vars:{
							[memoryArrayId]:source
						},
						in:this[functionCall.function.name](child, mongoQuery, "$$" + memoryArrayId, functionCall)
					}
				}
			}
		},
		async find(scope, mongoQuery, source, functionCall){
			
			return {
				$arrayElemAt:[{
					$filter:{
						input:source,
						as:functionCall.args[1].args[0].source.name,
						cond:await buildExpr(scope,mongoQuery,functionCall.args[1])
					}
				},0]
			}
		}
	},
	model:{
		async handle(scope, mongoQuery, functionCall){
			return await this[functionCall.function.name](scope, mongoQuery, functionCall);
		},
		async eq(scope, mongoQuery, functionCall){
			var result = [];
			for(var arg of functionCall.args){
				debugger
				var id = await scope.getValue(arg,"id");
				if(!id.startsWith("$"))
					id = new mongo.ObjectId(id)
				result.push(id)
			}
			return {
				$eq:result
			}
		}
	}
}


async function buildExprArg(scope,mongoQuery, arg){
	if(arg instanceof Handler){
		if(arg.virtual instanceof types.dynamicObject){
			var result = {};
			for(var p in arg.virtual){
				result[p] = await buildExprArg(scope,mongoQuery, arg.virtual[p]._handler);
			}
			return result;
		}
		else if(arg.source instanceof Property){
			if(arg.source.path == "length" && arg.source.source instanceof Array.handler){
				return {
					$size:await scope.getValue(arg)
				}
			}
			return await scope.getValue(arg)
		}
		else if(arg.source instanceof FunctionCall){
			return await exprTypeHandlers.handle(scope, mongoQuery, arg.source.statment);
		}
		else if(arg.source instanceof Var){
			var source = scope.getSource("$" + arg.source.name);
			if(source instanceof Path){
				return source.value;
			}
			else
				return source;
		}
		else
			return arg.source
	}
	else
		return arg;	
}

async function externalScope(scope, statment){
	
	var result = [];
	for(var arg of statment.args){
		if(arg instanceof VScope){
			
		}
		else{
			if(arg.source instanceof SourcesEnum.functionCall){
				if(externalScope(scope, arg.source.statment))
					return null;
			}
			else if(arg.source instanceof Source){
				var source = await scope.getValue(arg);
				if(source instanceof MemoryArray){
					result.push(source);
				}
				else if(source instanceof Path){
					return null;
				}	
				else
					result.push(source);
			}
			else
				result.push(arg);
		}
		return (result.length && result) || null;
	}
}

async function lookupWrapper(scope, mongoQuery, functionCall, root){
	var prefix =  [];
	var index = mongoQuery.pipeline.length;
	var handler = functionCall.args[0];
	async function check(){
		if(!(handler.source.source instanceof SourcesEnum.var))
			return true;
		else{
			var source = await scope.getValue(handler.source.source);
			if(source != "$$CURRENT"){
				return true;
			}
			else{
				root = handler.source.source;
				return false;
			}
		}
	}
	while(await check()){
		if(handler.source instanceof Property){
			handler = handler.source.source;
		}
		else if(handler.source instanceof FunctionArg){
			var save = handler;
			handler = handler.source.functionCall.args[0];
			prefix.push(handler.source.path)
			var operation
			if(root){
				operation = {
					$group:{
						_id:"$id"
					}
				}
				/*
				for(var propertyName in root.constructor.virtual.properties){
					operation.$group[propertyName] = {
						$first:'$' + propertyName
					}
				}
				/**/

				operation.$group[handler.source.path]={
					$push:"$" + handler.source.path
				}
			}
			else{
				operation = {
					$unwind:{
						path:"$" + handler.source.path
					}
				}
			}
			mongoQuery.pipeline.splice(index,0,operation);
		}
		else
			throw new Error()
	}
	return {
		prefix:prefix.join("."),
		root
	}
}

function buildPath(array){
	return array.filter((s)=>s).join(".");
}

async function buildExpr(scope,mongoQuery,fn){
	var switchExpr;

	for(var statment of fn.statments){
		if(statment.type == "functionCall"){
			var externalArgs = externalScope(scope, statment);
			if(externalArgs){
				var hasMemoryArray=  false;
				for(var arg of externalArgs){
					hasMemoryArray = true;
					if(arg instanceof MemoryArray){
						for(var object of arg.array){
							var child = scope.child();
							child.setVar(arg,object)
							child.source.processFunctionCall(child, statment);
						}
					}
				}
				if(!hasMemoryArray){
					scope.source.processFunctionCall(scope, statment);
				}

			}
			else if(statment.function.name == "load"){

				var type = statment.function.type;
				var result = lookupWrapper(scope,  mongoQuery, statment);
				var prefix = result.prefix;
				if(type == types.model){
					var model = statment.args[0]
					var parentCurrentId = utils.gererateVariableId();
					mongoQuery.pipeline.push({
						$lookup:{
							from:model.typeName + "s",
							let:{
								[parentCurrentId]:'$$CURRENT'
							},
							as:buildPath([prefix,model.source.path]),
							pipeline:[{
								$match:{
									$expr:{
										$eq:["$$CURRENT._id",buildPath(["$$" + parentCurrentId,prefix,model.source.path,'id'])]
									}
								}
							},
							{
								$addFields:{
									id:'$_id'
								}
							}]
						}
					})
					mongoQuery.pipeline.push({
						$addFields:{
							[buildPath([prefix,model.source.path])]:{
								$arrayElemAt:["$" + buildPath([prefix,model.source.path]),0]
							}
						}
					})
				}
				else if(type == types.hasMany){
					var hasMany = statment.args[0]
					var parentCurrentId = utils.gererateVariableId();
					mongoQuery.pipeline.push({
						$lookup:{
							from:hasMany.type.typeName + "s",
							as:hasMany.source.path,
							let:{
								[parentCurrentId]:'$$CURRENT'
							},
							pipeline:[{
								$match:{
									$expr:{
										$eq:[buildPath(["$$CURRENT",prefix,hasMany.source.source.typeName,"id"]),"$$" + parentCurrentId + "._id"]
									}
								}
							},{
								$addFields:{
									id:'$_id'
								}
							}]
						}
					})
					
				}
				lookupWrapper(scope,  mongoQuery, statment,result.root);
			}
			else if(statment.function.name == "if"){

				var child = scope.child();
				switchExpr = {
					branches:[{
						case:await buildExprArg(scope,mongoQuery,statment.args[0]),
						then:await buildExpr(child,mongoQuery,statment.args[1])
					}]
				}
			}
			else if(statment.function.name == "elseif"){
				var child = scope.child();
				switchExpr.branches.push({
					case:await buildExprArg(scope,mongoQuery,statment.args[0]),
					then:await buildExpr(child,mongoQuery,statment.args[1])
				})
			}
			else if(statment.function.name == "else"){
				var child = scope.child();
				switchExpr.default = await buildExpr(child,mongoQuery,statment.args[0])
			}
			
		}
		else if(statment.type == "return"){
			if(switchExpr){
				if(switchExpr.default)
					throw new Error();
				switchExpr.default = await buildExprArg(scope,mongoQuery,statment.args[0]);	
			}
			else{
				return await buildExprArg(scope,mongoQuery,statment.args[0]);	
			}
		}	
	}
	if(!switchExpr.default)
		switchExpr.default = null;
	return  {
		$switch:switchExpr
	}
}



var functionHandlers =  {
	handle:async function(scope,functionCall){	
		if(functionCall.function.type != Array)
			return
		var mongoQuery = await getMongoQuery(scope,functionCall.args[0]);
		var functionName = functionCall.function.name
		if(mongoQuery){
			if(['filter','map'].indexOf(functionName) != -1){
				var childScope = scope.child();
				childScope.setSource(functionCall.args[1].args[0],new Path("$$CURRENT"));
				return this[functionName](childScope,mongoQuery,functionCall);
			}
			else
				return await this[functionName](scope,mongoQuery,functionCall);	
		}
	},
	filter:async (scope,mongoQuery,functionCall)=>{		
		mongoQuery.pipeline.push({
			$match:{
				$expr:await buildExpr(scope,mongoQuery,functionCall.args[1])
			}
		})
		return mongoQuery
	},
	map:async (scope, mongoQuery,  functionCall)=>{
		mongoQuery.pipeline.push({
			$project:{
				...(await buildExpr(scope,mongoQuery, functionCall.args[1])),
				_id:0
			}
		})
		return mongoQuery
	},
	atIndex:async (scope, mongoQuery,functionCall)=>{
		mongoQuery.pipeline.push({
			$skip:await scope.getValue(functionCall.args[0])
		},{
			$limit:1
		})
	},
	push:(scope,mongoQuery,functionCall)=>{
		if(mongoQuery.pipeline.length)
			return
		mongoQuery.action = {
			type:"insert",
			args:[scope.source.processArg(functionCall.args[1])]
		}
		mongoQuery.then.push((result)=>{			
			return result;
		})
		return mongoQuery;
	}
}

async function getMongoQuery(scope,virtual){
	if(virtual.source instanceof FunctionCall){
		return await functionHandlers.handle(scope,virtual.source.statment)
	}
	else if(virtual instanceof types.collection.handler){

		return {
			action:null,
			model:virtual.source.path,
			pipeline:[{
				$addFields:{
					id:'$_id'
				}
			}],
			then:[]
		}
	}
	else if(virtual.source instanceof Property && virtual.source.source){		
		var mongoQuery = await getMongoQuery(scope,virtual.source.source)
		if(mongoQuery){
			if(virtual.source.path == "length"){
				mongoQuery.pipeline.push({
					$count:"length"
				})
				mongoQuery.then.push((results)=>{
					return results[0].length
				})
			}
			return mongoQuery
		}
	
	}
}




module.exports = class Mongodb extends ExecutingHandler {

	constructor(options){
		super();
		this.options = options;
		this.cache = []
	}

	async setup(source){
		super.setup(source);
		this.client = await mongo.MongoClient.connect(this.options.url,{
      useUnifiedTopology:true
    })
    this.db = this.client.db(this.options.db);
	}

	async canProcessArg(scope, arg){
		var mongoQuery = await getMongoQuery(scope, arg);
		if(mongoQuery)
			this.cache.push([arg,mongoQuery]);
		return mongoQuery
	}

	async processArg(scope, arg){
		var mongoQuery = this.cache.find((c)=>c[0] == arg)[1];
		return await this.executeMongoQuery(mongoQuery);
	}

	async executeMongoQuery(mongoQuery){
		console.log(JSON.stringify(mongoQuery,null,' '))
		var collection = this.db.collection(mongoQuery.model);
		var result;
		if(mongoQuery.pipeline){
			result = await collection.aggregate(mongoQuery.pipeline).toArray();
		}
		return result;
	}

	async stop(){
		await this.client.close();
	}
}