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
const Executable = require("sools/executing/Executable")

function buildPath(...args){
	if(args.length == 1 && args[0] instanceof Array)
		return args[0].filter((s)=>s).join(".");
	else
		return args.filter((s)=>s).join(".");
}


module.exports = class Query extends Executable {
	constructor(model, parent){
		super();	
		this.parent = parent;
		this.model = model;
		this.pipeline = [{
			$addFields:{
				id:'$_id'
			}
		}];
	}

 	attach(source){
 		this.source = source;
 	}

	processReturn(){
		var scope = this.scope;
		var arg = this.arg;
		var mongoQuery = this;

		if(!mongoQuery.pipeline.length)
			return

		function build(ref, path){
			
			if(ref.type.prototype instanceof Virtuals.array){
				var varId = utils.gererateVariableId()
				return {
					$map:{
						input:path,
						as:varId,
						in:build(ref.refs.type,"$$" + varId)
					}
				}
			}
			else if(ref.type == Virtuals.dynamicObject){
				var result = {};
				for(var p in ref.refs){
					result[p] = build(ref.refs[p], buildPath(path, p))
				}
				return result;
			}
			else{
				var result = {
					_id:"$$REMOVE"
				};
				for(var propertyName in ref.type.properties){
					var property = ref.type.properties[propertyName];
					var propertyRef =  ref.refs[propertyName]
					if(propertyRef && propertyRef.isIncluded){
						result[propertyName] = build(propertyRef,buildPath(path,propertyName))
					}
					else if(property.type.prototype instanceof Virtuals.model){
						result[propertyName] = {
							id:buildPath(path, propertyName,"id")
						}	
					}
					else if(property.type == Virtuals.hasMany){
							result[propertyName] = "$$REMOVE"
					}
					else{
						result[propertyName] = buildPath(path,propertyName)
					}
				}
				return result
			}
		}
		
		if(arg.virtual instanceof Virtuals.array){
			arg = arg.type;
		}
		mongoQuery.pipeline.push({
			$addFields:build(arg.ref,"$$CURRENT")
		})
	}

	clone(){
		var clone = new Query(this.model,this);
		clone.pipeline = this.pipeline;
		return clone;
	}

	async execute(){
		//this.processReturn()
		this.pipeline.push({
			$addFields:{
				_id:'$$REMOVE'
			}
		})
		console.log(this.model,JSON.stringify(this.pipeline,null,' '))
		var collection = this.source.db.collection(this.model);
		var result;
		if(this.pipeline){
			result = await collection.aggregate(this.pipeline).toArray();
		}
		return result;
	}
}