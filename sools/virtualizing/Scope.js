const Virtual = require("./Virtual")
const Statement = require("./Statement")
const Handler = require("./Handler")
const HandlerOptions = require("./Handler/Options")
const Functions = require("./functions");
const FunctionCall = require("./Source/enum/FunctionCall")
const Function = require("./Virtual/enum/Function")

var types = [
	require("./Virtual/enum/Function"),
	require("./Virtual/enum/DynamicObject"),
	require("./Virtual/enum/Array"),
	require("./Virtual/enum/Number"),
	require("./Virtual/enum/Boolean"),
	require("./Virtual/enum/String")
]

var id = 0;
class Scope{
	constructor(env){
		this.id = id++;
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
				var fn = Functions.findByUpperCase(property);
				if(fn){
					return (...args)=>{
						return fn.call(this,args);
					};
				}
			},
			apply:(obj,self,args)=>{
				return this.parse(args);
			}
		})
	}

	parse(args){
		for(var type of types){
			if(type.handler.cast(...args)){
				return type.handler.parse(this, ...args)
			}
		}
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
		var result = fn(...args,this.$);		
		if(result != null){
			if(!(result instanceof Virtual))
				result = this.parse([result])
			Functions.return.call(this,[this.processArg(result)])
		}
		if(this.parent)
			this.parent._child = null;
		
		this.args = args.map((arg)=>(arg && arg._handler) || arg);
		return this;
	}

	get lastStatment(){
		return  this.statements[this.statements.length - 1];
	}

	processArg(arg){
		if(arg instanceof Virtual){
			return arg._handler.process(this);
		}
		else if(arg instanceof Handler){
			return arg.process(this);
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
		var result = this.vars.find((v)=>v.source.name == name);
		if(result)
			return result
		return this.parent && this.parent.getVar(name) || null
	}


	toJSON(){
		return {
			argNames:this.args && this.args.filter((arg)=>arg).map((arg)=>{
				return arg && arg.source.name
			}),
			statements:this.statements.map((s)=>s.toJSON())
		}
	}

	static build(scope, object){
		var scope = scope.child();
		scope.argNames = object.argNames;
		for(var statment of object.statments){
			scope.statments.push(Statment.build(scope,statment))
		}
		return scope;
	}

}

Statement.scope = Scope

module.exports =  Scope;