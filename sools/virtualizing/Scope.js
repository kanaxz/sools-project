const Virtual = require("./Virtual")
const Handler = require("./Handler")
const HandlerOptions = require("./Handler/Options")
const FunctionCall = require("./Source/enum/FunctionCall")
const Return = require("./functions/Return")
const Declare = require("./functions/Declare")
const utils = require("./utils")
const String = require("./Virtual/enum/String")
const Value = require("./Source/enum/Value")
const Var = require("./Source/enum/Var")
var id = 0;

function processSource(arg){

	if(arg.source instanceof FunctionCall){	
		
		if(arg.scope == arg.scope.target && arg.source == arg.scope.lastStatment){
			arg.scope.statements.splice(-1,1)
			arg.scope.removedStatements.push({
				index:arg.scope.statements.length,
				functionCall:arg.source
			})	
		}		
		else{
			var removedStatement = arg.scope.removedStatements.find((rs)=>rs.functionCall == arg.source);
			if(removedStatement){
				var index = arg.scope.removedStatements.indexOf(removedStatement);
				arg.scope.statements.splice(removedStatement.index,0,removedStatement.functionCall);
				arg.scope.removedStatements.splice(index,1)
			}
			var id= utils.gererateVariableId()
			var variable = arg.clone({
				source:new Var(id),
				scope:arg.scope
			});
			var index = arg.scope.statements.indexOf(arg.source);
			if(index == -1){
				debugger
				throw new Error("Could not found statment")
			}
			var idVar = new String(new HandlerOptions({
				source:new Value(id)
			}))._handler
			arg.scope.statements.splice(index,1,new FunctionCall({
				scope:arg.scope,
				function:Declare,
				args:[idVar,arg.clone({scope:arg.scope,source: arg.source})]
			}));
			arg.source = variable._handler.source;
		}
	}		
	return arg;	
}


class Scope{
	constructor(env){
		this.id = (id++)
		this._env = env;
		this.statements = [];
		this.removedStatements = [];
		this.vars = [];
		this.$ = new Proxy(()=>{},{
			get:(obj,property)=>{
				if(property == "_private")
					return this;
				var theVar = this.getVar(property);
				if(theVar)
					return theVar.virtual
				var fn = this.env.functions.findByUpperCase(property);
				if(fn){
					return (...args)=>{
						return fn.call(this.target,args);
					};
				}
			},
			apply:(obj,self,args)=>{
				return this.parse(args[0]);
			}
		})
	}

	parse(arg){
		for(var typeName in this.env.types){

			var type = this.env.types[typeName]		
			if(type.handler.cast(arg)){
				return type.handler.parse(this, arg)
			}
		}
		throw new Error("Could not parse arg");
	}

	get target(){
		return this._child && this._child.target || this;
	}

	get env(){
		return this.parent && this.parent.env || this._env;
	}

	child(){
		var child = new Scope();
		child.parent = this;
		this._child = child;
		return child;
	}

	process(fn,...args){
		if(typeof(fn) != "function")
			debugger
		var processArgs = args.map((arg)=>{
			if(arg instanceof Scope.function){
				return arg.calleable(this)
			}
			return arg;
		})
		var result = fn(...processArgs,this.$);		
		if(result != null){
			if(!(result instanceof Virtual))
				result = this.parse(result)
			Return.call(this,[result])
		}
		if(this.parent){
			this.parent._child = null;
		}
		
		this.args = args.map((arg)=>(arg && arg._handler) || arg);
		return this;
	}

	get lastStatment(){
		return  this.statements[this.statements.length - 1];
	}

	processArg(arg){
		if(arg instanceof Virtual){
			return processSource(arg._handler)
		}
		else if(arg instanceof Handler){
			return processSource(arg)
		}
		else if(arg instanceof Scope){
			
		}
		
		else if(typeof(arg) == "object"){
			debugger
			for(var p in arg)
				this.processArg(arg[p])
		}
		/**/
		return arg;
	}

	getVar(name){
		var result = this.vars.find((v)=>{
			if(!v.source)
				debugger
			return v.source.name == name
		});
		if(result)
			return result
		return this.parent && this.parent.getVar(name) || null
	}


	toJSON(){
		return {
			argNames:this.args && this.args.filter((arg)=>arg).map((arg)=>{
				return arg.source.toJSON && arg.source.toJSON() || arg.source
			}),
			statements:this.statements.map((s)=>s.toJSON())
		}
	}
}

module.exports =  Scope;