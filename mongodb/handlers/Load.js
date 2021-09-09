const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const Path = require("../virtuals/Path")
const utils = require("../utils")
const Virtuals = require("sools/modeling/virtualizing/Virtual/enum")
const Handler = require("./Handler");
const Collection = require("../virtuals/Collection")
class Load extends Handler {
	async processFunctionCall(scope, functionCall){
		if(['load','unload'].indexOf(functionCall.function.name) != -1){

			var target = await scope.getValue(functionCall.args[0],Path);
			var env = target instanceof Path ? "virtual":"memory";
			await envs[env][functionCall.function.name](scope,functionCall,this.source)
			return null	
		}
	}
}

var envs = {
	memory:{
		async load(scope,functionCall,source){
			var arg = functionCall.args[0]
			var type = arg.constructor.virtual;
			if(type.prototype instanceof Virtuals.hasMany){
				type = type.template;
			}
			debugger
			var query = new Query(new Collection(type.typeName + "s",source))
			var child = utils.childScope(scope, query);
			child.setValue(functionCall.args[1].source.scope.args[0],query)
			query = await child.process(functionCall.args[1].source.scope)
			var result = await query.getValue(scope);
			if(!(arg.virtual instanceof Virtuals.hasMany)){
				result = result[0]
			}
			var parent = await scope.getValue(arg.source.source); 
			parent[arg.source.path] = result;
			return null
		}
	},
	virtual:{
		load:async function (scope, functionCall){
			var root = await utils.getRoot(scope, functionCall.args[0]);
			var type = functionCall.function.type;
			
			var from;
			var split = root.path.split(".")
			split.shift()
			var as = split.join(".");
			split.pop()
			var parentPath = ["$$CURRENT",split.join(".")].filter((s)=>s).join(".");
			if(type == Virtuals.model){
				var model = functionCall.args[0]
				from = model.typeName + "s";
			}
			else if(type == Virtuals.hasMany){
				var hasMany = functionCall.args[0]
				from = hasMany.template.typeName + "s"
			}
			var subMongoQuery = new Query();
			var child = utils.childScope(scope, subMongoQuery,true);
			var parentCurrentId = utils.gererateVariableId();
			child.setValue(root.handler,new Path("$$" + parentCurrentId))
			if(functionCall.args[1]){
				child.setValue(functionCall.args[1].source.scope.args[0],subMongoQuery);
				subMongoQuery = await child.process(functionCall.args[1].source.scope)
			}
			if(!subMongoQuery)
				return null;
			/**/
			root.query.pipeline.push({
				$lookup:{
					from,
					as,
					let:{
						[parentCurrentId]:parentPath
					},
					pipeline:subMongoQuery.pipeline
				}
			})
			if(type == Virtuals.model){
				var model = functionCall.args[0]
				root.query.pipeline.push({
					$addFields:{
						[as]:{
							$arrayElemAt:["$" + as,0]
						}
					}
				})
			}
		},
		unload:async function(scope, functionCall){	
			var root = await utils.getRoot(scope, functionCall.args[0]);
			var path = await scope.getValue(functionCall.args[0],Path);
			var split = path.value.split(".")
			split.shift();
			path = split.join(".")
			var format;
			var arg = functionCall.args[0];
			if(arg instanceof Virtuals.hasMany.handler){
				format = "$$REMOVE"
			}
			else{
				format = {};
				for(var propertyName in arg.constructor.virtual.properties){
					var property = arg.constructor.virtual.properties[propertyName]
					if(property.type == Virtuals.hasMany)
						format[propertyName] = "$$REMOVE"
					else if(property.type.prototype instanceof Virtuals.model){
						format[propertyName] = {
							_id: path + "." + propertyName + "._id"
						};
					}
					else
						format[propertyName] = "$$REMOVE"
				}
				format._id = "$" + path + "._id"
			}
			root.query.pipeline.push({
				$addFields:{
					[path]:format
				}
			})
		}
	}
}



module.exports = Load