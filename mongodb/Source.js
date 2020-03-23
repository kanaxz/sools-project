const ExecutingHandler = require("sools/executing/Handler");
const VScope =  require("sools/virtualizing/Scope");
const Statement = require("sools/virtualizing/Statement");
const Env = require("sools/virtualizing/Env");
const mongo = require('mongodb');
const Handler = require("sools/virtualizing/Handler")
const utils = require("./utils");
const Path = require("sools/executing/Path");
const Functions = require("sools/virtualizing/functions");
const Source = require("sools/virtualizing/Source")
const Sources = require("sools/virtualizing/Source/enum")
const Virtual = require("sools/virtualizing/Virtual");
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Query = require("./Query");
const MongoScope = require("./Scope")

function childScope(scope, query, isLookup){
	var child = new MongoScope(query,isLookup)
	child.parent = scope;
	return child;
}

class RootPath extends Path {
	constructor(path){
		super(path);
	}
}

var exprTypeHandlers = {
	async handle(scope, mongoQuery, functionCall){
		if(functionCall.function.source instanceof Sources.function){
			if(functionCall.function.source instanceof Sources.method)
				return await this[functionCall.function.source.type.typeName].handle(scope, mongoQuery, functionCall);
			else 
				return await this.functions.handle(scope, mongoQuery, functionCall);	
		}
		else{
			var child = childScope(scope)
			var vars = {};
			var index = 0;
			for(var arg of functionCall.args){
				var varId = utils.gererateVariableId()
				vars[varId] = await buildExprArg(scope, mongoQuery, arg)
				child.setValue(functionCall.function.args[index++],new Path("$$" + varId))
			}
			return {
				$let:{
					vars,
					in:buildExpr(child, mongoQuery, functionCall.function.source.scope)	
				}
			}
		}
		
	},
	functions:{
		async handle(scope, mongoQuery, functionCall){
			return await this[functionCall.function.source.name](scope, mongoQuery, functionCall);
		},
		async not(scope, mongoQuery, functionCall){
			return {
				$not:await buildExprArg(scope, mongoQuery, functionCall.args[0])
			}
		}
	},
	base:{
		async handle(scope, mongoQuery, functionCall){
			var result = [];
			for(var arg of functionCall.args)
				result.push(await buildExprArg(scope,mongoQuery,arg))
			return {
				["$" + functionCall.function.source.name] : result
			}
		}
	},
	array:{
		async handle(scope, mongoQuery, functionCall){
			debugger
			var source = await getExprArg(scope, mongoQuery, functionCall.args[0])
			var object = functionCall.args[1].source.scope.args[0]
			
			
			if(source instanceof Path){
				return await arrayFunctionCallWrapper(scope,functionCall,mongoQuery,async (child)=>{
					child.setValue(object, new Path("$$" + object.source.name))
					return await this[functionCall.function.source.name](child, mongoQuery, source.value, functionCall)	
				})
				
			}
			else{
				var child = childScope(scope);
				child.setValue(object, new Path("$$" + object.source.name))
				var memoryArrayId = utils.gererateVariableId();
				if(source.toJSON)
					source = source.toJSON();
				return {
					$let:{
						vars:{
							[memoryArrayId]:source
						},
						in:await this[functionCall.function.source.name](child, mongoQuery, "$$" + memoryArrayId, functionCall)
					}
				}
			}

		},
		async find(scope, mongoQuery, source, functionCall){		
			return {
				$arrayElemAt:[{
					$filter:{
						input:source,
						as:functionCall.args[1].source.scope.args[0].source.name,
						cond:await buildExpr(scope,mongoQuery,functionCall.args[1])
					}
				},0]
			}
		},
		async map(scope ,mongoQuery, source, functionCall){
			return {
				$map:{
					input:source,
					as:functionCall.args[1].args[0].source.name,
					in:await buildExpr(scope,mongoQuery,functionCall.args[1])
				}
			}
		}
	},
	model:{
		async handle(scope, mongoQuery, functionCall){
			return await this[functionCall.function.source.name](scope, mongoQuery, functionCall);
		},
		async eq(scope, mongoQuery, functionCall){
			var result = [];
			for(var arg of functionCall.args){
				var id = await getExprArg(scope, mongoQuery,arg,"id");
				if(!(id instanceof Path))
					id = new mongo.ObjectId(id)
				else
					id = id.value
				result.push(id)
			}
			return {
				$eq:result
			}
		}
	}
}

async function getExprArg(scope ,mongoQuery, arg, path){
	var result = await (async ()=>{
		if(arg instanceof Handler){
			if(arg.virtual instanceof Virtuals.dynamicObject){
				var result = {};
				for(var p in arg.virtual){
					result[p] = await buildExprArg(scope,mongoQuery, arg.virtual[p]._handler);
				}
				return result;
			}
			else if(arg.source instanceof Sources.property){
				if(arg.source.path == "length" && arg.source.source instanceof Virtuals.array.handler){
					return {
						$size:await buildExprArg(scope, arg.source.source)
					}
				}
				return await scope.getValue(arg)
			}
			else if(arg.source instanceof Sources.functionCall){
				return await exprTypeHandlers.handle(scope, mongoQuery, arg.source);
			}
			else if(arg.source instanceof Sources.var){
				return await scope.getValue(arg);
			}
			else
				return arg.source
		}
		else
			return arg;	
	})();
	if(result instanceof Path)
		return new Path([result.value , path].filter((s)=>s).join("."))
	else if(path){
		var split = path.split(".");
		for(var segment of split)
			result = result[segment];
		return result;
	}
	else
		return result
}

async function buildExprArg(scope,mongoQuery, arg){
	var exprArg = await getExprArg(scope, mongoQuery, arg);
	if(exprArg instanceof Path)
		return exprArg.value
	else
		return exprArg
}

function buildPath(...args){
	if(args.length == 1 && args[0] instanceof Array)
		return args[0].filter((s)=>s).join(".");
	else
		return args.filter((s)=>s).join(".");
}

async function load(scope,mongoQuery, functionCall){
	var root = await getRoot(scope, functionCall.args[0]);
	var type = functionCall.function.source.type;
	
	var from;
	var split = root.path.split(".")
	split.shift()
	var as = split.join(".");
	if(type == Virtuals.model){
		var model = functionCall.args[0]
		from = model.typeName + "s";
	}
	else if(type == Virtuals.hasMany){
		var hasMany = functionCall.args[0]
		from = hasMany.type.typeName + "s"
	}
	var subMongoQuery = new Query();
	var child = childScope(scope, subMongoQuery,true);
	var parentCurrentId = utils.gererateVariableId();
	child.setValue(root.handler,new Path("$$" + parentCurrentId))
	if(functionCall.args[1]){
		child.setValue(functionCall.args[1].source.scope.args[0],subMongoQuery);
		subMongoQuery = await buildPipeline(child,functionCall.args[1].source.scope);	
	}
	if(!subMongoQuery)
		return null;
	var split = root.path.split(".")
	split.splice(split.length - 1,1);
	/**/
	mongoQuery.pipeline.push({
		$lookup:{
			from,
			as,
			let:{
				[parentCurrentId]:split.join(".")
			},
			pipeline:[
				...subMongoQuery.pipeline,{
				$addFields:{
						_id:'$$REMOVE'
					}
			}]
		}
	})
	if(type == Virtuals.model){
		var model = functionCall.args[0]
		mongoQuery.pipeline.push({
			$addFields:{
				[as]:{
					$arrayElemAt:["$" + as,0]
				}
			}
		})
	}
}



async function buildPipeline(scope, vscope){
	for(var statement of vscope.statements){
		var functionCall = statement.functionCall
		if(functionCall.function.source instanceof Sources.function){
			var functionName = functionCall.function.source.name;
			if(functionName == "return"){
				return await getMongoQuery(scope, functionCall.args[0])
			}
		}
		else {
		 //
		}
	}
}

async function getRoot(scope, handler){
	var path = []
	var root;
	async function check(){
		if(handler.source instanceof Sources.var){

			var pairs = scope.getPairs(handler);			
			var pair = pairs.find((pair)=>{
				return pair.value instanceof RootPath
			})
			if(!pair)
				debugger
			var value = pair.value;
			/*
			var split = value.value.split(".")
			split.shift()
			value = split.join(".")
			/**/
			if(value != "")
				path.unshift(value.value);
			root = handler;
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
		else
			throw new Error()
	}

	return {
		handler:root,
		path:path.join(".")
	}
}

async function arrayFunctionCallWrapper(scope, functionCall, mongoQuery, fn){
	var root = await getRoot(scope, functionCall.args[0]);
	var split = root.path.split(".")
	split.shift();
	var path = split.join(".");
	mongoQuery.pipeline.push({
		$unwind:{
			path:"$" + path
		}
	})
	var length = mongoQuery.pipeline.length;
	var child = childScope(scope);
	child.setValue(functionCall.args[1].source.scope.args[0],new RootPath(root.path))
	var result = await fn(child)
	if(mongoQuery.pipeline.length == length){
		mongoQuery.pipeline.splice(mongoQuery.pipeline.length - 1, 1)
		return result
	}

	var group = {
		_id:'$id'
	};
	for(var propertyName in root.handler.constructor.virtual.properties){
		group[propertyName] = {
			$first:'$' + propertyName
		}
	}
	group[path] = {
		$push: "$" + path
	}
	mongoQuery.pipeline.push({
		$group:group
	});
	return result
}


async function buildExpr(scope,mongoQuery,arg){
	var switchExpr;
	var vscope;
	if(arg instanceof VScope){
		vscope = arg;
	}
	else if(arg instanceof Virtuals.function.handler){
		if(arg.source instanceof Sources.dynamicFunction){
			vscope = arg.source.scope;
		}
		else {

		}
	}
	for(var statement of vscope.statements){
		var functionCall = statement.functionCall;
		if(functionCall.function.source instanceof Sources.function){
			var functionName = functionCall.function.source.name;
			if(functionName == "load"){

				await load(scope, mongoQuery,	functionCall)
			}
			else if(functionName == "forEach"){
				await arrayFunctionCallWrapper(scope,functionCall,mongoQuery,async (child)=>{
					var expr = await buildExpr(child,mongoQuery,functionCall.args[1].source.scope)
					if(expr)
					throw new Error()
				})

			}
			else if(functionName == "if"){

				var child = childScope(scope);
				switchExpr = {
					branches:[{
						case:await buildExprArg(scope,mongoQuery,functionCall.args[0]),
						then:await buildExpr(child,mongoQuery,functionCall.args[1])
					}]
				}
			}
			else if(functionName == "elseif"){
				var child = childScope(scope);
				switchExpr.branches.push({
					case:await buildExprArg(scope,mongoQuery,functionCall.args[0]),
					then:await buildExpr(child,mongoQuery,functionCall.args[1])
				})
			}
			else if(functionName == "else"){
				var child = childScope(scope);
				switchExpr.default = await buildExpr(child,mongoQuery,functionCall.args[0])
			}
			else if(functionName == "return"){
				if(switchExpr){
					if(switchExpr.default)
						throw new Error();
					switchExpr.default = await buildExprArg(scope,mongoQuery,functionCall.args[0]);	
				}
				else{
					return await buildExprArg(scope,mongoQuery,functionCall.args[0]);	
				}
			}	
		}
	}
	if(!switchExpr)
		return null
	if(!switchExpr.default)
		switchExpr.default = null;
	return  {
		$switch:switchExpr
	}
}


var functionHandlers =  {
	handle:async function(scope,functionCall){	
		var mongoQuery = await getMongoQuery(scope,functionCall.args[0]);
		if(!mongoQuery)
			return
	
		var functionName = functionCall.function.source.name
		if(['filter','map','forEach'].indexOf(functionName) != -1){
			if(functionName != "forEach")
				mongoQuery = mongoQuery.clone();

			var child = childScope(scope, mongoQuery);
			child.setValue(functionCall.args[1].source.scope.args[0],new RootPath("$$CURRENT"));
			return await this[functionName](child,mongoQuery,functionCall);
		}
		else
			return await this[functionName](scope,mongoQuery,functionCall);	

	},
	forEach:async (scope,mongoQuery,functionCall)=>{	
			
		var expr = await buildExpr(scope,mongoQuery,functionCall.args[1])
		if(expr){
			throw new Error()
		}
		return mongoQuery

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
		var result = await buildExpr(scope,mongoQuery, functionCall.args[1])
		if(typeof(result) != "object"){
			if(result == "$$CURRENT")
				return mongoQuery
			else
				throw new Error();
		}

		mongoQuery.pipeline.push({
			$project:{
				...result,
				_id:0
			}
		})
		return mongoQuery
	},
	atIndex:async (scope, mongoQuery,functionCall)=>{
		mongoQuery.pipeline.push({
			$skip:await scope.getValue(functionCall.args[1])
		},{
			$limit:1
		})
		mongoQuery.finish = true
		mongoQuery.then.push((result)=>{
			return result[0];
		})
		return mongoQuery
	},
	push:async (scope,mongoQuery,functionCall)=>{
		if(mongoQuery.pipeline.length)
			return
		mongoQuery.action = {
			type:"insert",
			args:[await scope.getValue(functionCall.args[1])]
		}
		mongoQuery.then.push((result)=>{			
			return result;
		})
		return mongoQuery;
	}
}

async function getMongoQuery(scope,virtual){	
	if(virtual.source instanceof Sources.functionCall){
		if(virtual.source.function.source instanceof Sources.dynamicFunction){
			var child = childScope(scope);
			var index=0
			for(var arg of virtual.source.args){
				var value = await scope.getValue(arg);
				child.setValue(virtual.source.function.source.scope.args[index++],value)
			}
			return await buildPipeline(child,virtual.source.function.source.scope)
		}
		else
			return await functionHandlers.handle(scope,virtual.source)
	}
	else if(virtual instanceof Virtuals.collection.handler){
		return new Query(virtual.source.path)
	}
	else if(virtual.source instanceof Sources.property && virtual.source.source){		
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
	else if(virtual.source instanceof Sources.var){		
		var pair = scope.getPair(virtual);
		if(pair && pair.value instanceof Query)
			return pair.value
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

	async processFunctionCall(scope, functionCall){
		if([Virtuals.model,Virtuals.hasMany].indexOf(functionCall.function.source.type) != -1 && functionCall.function.source.name == "load"){
			var arg = functionCall.args[0]
			
			var query = new Query(functionCall.args[0].property.model.typeName + "s")

			var child = childScope(scope, query);
			child.setValue(functionCall.args[1].source.scope.args[0],query)

			await buildPipeline(child,functionCall.args[1].source.scope)
			/*
			var rtrn = functionCall.args[1].source.scope.statements.find((s)=>s.functionCall.function.source.name == "return")
			var arg = rtrn.functionCall.args[0];
			/**/
			query.attach(this)
			debugger
			var result = await query.execute();
			var parent = await scope.getValue(arg.source.source); 
			parent[arg.source.path] = result;
			return null
		}
	}

	async processArg(scope, arg){
		var mongoQuery = await getMongoQuery(scope, arg);
		if(mongoQuery){
			mongoQuery.attach(this,scope, arg)
			return mongoQuery
		}
	}


	async stop(){
		await this.client.close();
	}
}