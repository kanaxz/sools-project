const Virtual = require("./Virtual")
const Statment = require("./Statment")
const Handler = require("./Handler")
const HandlerOptions = require("./Handler/Options")
const Functions = require("./Function/enum");

var types = [
	require("./Virtual/enum/Array"),
	require("./Virtual/enum/DynamicObject"),
	require("./Virtual/enum/Number"),
	require("./Virtual/enum/Boolean"),
	require("./Virtual/enum/String")
]


var id = 0;
class Scope{
	constructor(env){
		this.id = id++;
		this._env = env;
		this.statments = [];
		this.removedStatments = [];
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
			}
		})
	}

	parse(arg){
		if(arg instanceof Virtual)
			return arg;
		for(var type of types){
			if(type.handler.cast(arg)){
				return new type(new HandlerOptions({
					source:arg,
					scope:this.target
				}))
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
		var result = fn(...args,this.$);
		if(result != null){
			this.statments.push(this.statment({
				type:"return",
				args:[this.processArg(this.parse(result))]
			}))
			/**/
		}
		if(this.parent)
			this.parent._child = null;
		
		this.args = args;
		return this;
	}

	get lastStatment(){
		return  this.statments[this.statments.length - 1];
	}

	processArg(arg){
		if(arg instanceof Virtual){
			return arg._handler.process(this);
		}
		else if(arg instanceof Handler){
			return arg.process(this);
		}
		else if(arg instanceof Array){
			for(var o of arg)
				this.processArg(o);
		}
		else if(arg instanceof Scope){
			
		}
		else if(typeof(arg) == "object"){
			for(var p in arg)
				this.processArg(arg[p])
		}
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
				return arg && arg._handler.source.name
			}),
			statments:this.statments.map((s)=>s.toJSON())
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

Statment.scope = Scope

module.exports =  Scope;