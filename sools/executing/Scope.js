const Path = require("./Path");
const Source = require("../virtualizing/Source")
const Sources = require("../virtualizing/Source/enum")
const Executable = require("./Executable")

module.exports = class Scope{
	constructor(source){
		this._source = source;
		this.parent = null;
		this.values = [];
	}

	get source(){
		return this._source || this.parent.source
	}

	async executeExecutable(executable){
		debugger
		return await executable.execute();
	}

	async getValuePath(value, path){
		if(value instanceof Executable)
			value = await this.executeExecutable(value)
		if(value instanceof Path)
			return new Path([value.value , path].filter((s)=>s).join("."))
		else if(path){
			var split = path.split(".");
			var result = value;
			for(var segment of split)
				result = result[segment];
			return result;
		}
		else
			return value

	}

	async getValue(arg, path){
		if((arg.source instanceof Sources.functionCall) || typeof(arg.source) == "undefined"){
			return await this.getValuePath(await this.source.processArg(this,arg),path)
		}
		else if(!(arg.source instanceof Source) || arg.source instanceof Sources.values){
			return await this.getValuePath(arg.source,path);
		}
		else if(arg.source instanceof Sources.property){
			return await this.getValuePath(await this.getValue(arg.source.source),[arg.source.path,path].filter((s)=>s).join("."));
		}
		else if(arg.source instanceof Sources.var){
			var pair = this.getPair(arg)
			var value;
			if(!pair)
				value = await this.source.processArg(this,arg)
			else
				value = pair.value
			return await this.getValuePath(pair.value,path);
		}
	}

	getPairs(arg){
		return [...this.values.filter((kv)=>kv.arg.source == arg.source),...((this.parent && this.parent.getPairs(arg)) || [])]
	}

	getPair(arg){
		var pair = this.values.reverse().find((kv)=>kv.arg.source == arg.source);
		if( pair)
			return pair
		return this.parent && this.parent.getPair(arg);
	}

	setValue(arg,value){
		this.values.push({arg,value});
	}

	async process(vscope){
		for(var statement of vscope.statements){
			if(statement.functionCall.function.source.name == "return"){
				return await this.source.processFunctionCall(this,statement.functionCall);
			}
			else{
				await this.source.processFunctionCall(this,statement.functionCall);		
			}
		}
	}


	child(){
		var child = new Scope();
		child.parent = this;
		return child;
	}
}
