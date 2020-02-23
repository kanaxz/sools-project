const Path = require("./Path");
const Source = require("../virtualizing/Source")
const SourcesEnum = require("../virtualizing/Source/enum")

var statmentHandlers = {
	return:async (scope,statment)=>{
		return await scope.source.processArg(scope,statment.args[0]);
	},
	functionCall:async (scope,statment)=>{
		
	},
	assignation:async(scope,statment)=>{
		scope.setSource(statment.args[1].source,await scope.source.processArg(scope,statment.args[0]));
	}
}

module.exports = class Scope{
	constructor(source){
		this._source = source;
		this.parent = null;
		this.sources = [];
	}

	get source(){
		return this._source || this.parent.source
	}

	async getValue(...args){
		if(args.length == 2){
			var arg = args[0]
			var source = arg.source;
			var path = args[1];
			var split = path.split(".")
			if(!(source instanceof Source)){
				return source
			}
			else if(source instanceof SourcesEnum.values){
				
				var current = source;
				for(var segment of split)
					current = current[segment];
				return current
			}
			else if(source instanceof SourcesEnum.property){
				return this.getValue(source.source,source.path + "." + path);
			}
			else if(source instanceof SourcesEnum.var){
				var result = this.getVar(source);
				if(result  instanceof Path){
					return [result.value,path].join(".");
				}
				else{
					for(var segment of split)
						result = result[segment];
					return result;
				}
			}
			else if(source instanceof SourcesEnum.functionCall){
				debugger
				var result = await this.source.processArg(this,arg);
				if(result  instanceof Path){
					return [result.value,path].join(".");
				}
				else{
					for(var segment of split)
						result = result[segment];
					return result;
				}
			}
		}
		else{
			var path = args[0]
			var split = path.split(".");
			var source = this.getSource(split[0]);
			split.shift()
			if(source  instanceof Path){
				return [source.value,...split].join(".");
			}
			else{
				for(var segment of split)
					source = source[segment];
			}
			return source;
		}
	}


	getVar(variable){
		return this.getSource("$" + variable.name)
	}

	getSource(key){
		for(var sourceKeyPair of this.sources){
			if(sourceKeyPair.key == key)
				return sourceKeyPair.source;
		}
		return this.parent && this.parent.getSource(key);
	}

	setSource(key,source){
		this.sources.push({key,source});
	}

	async process(vscope){
		for(var statment of vscope.statments){
			if(statment.type == "return"){
				return await statmentHandlers.return(this,statment);
			}
			else{
				await statmentHandlers[statment.type](this,statment)
			}
		}
	}


	child(){
		var child = new Scope();
		child.parent = this;
		return child;
	}
}
