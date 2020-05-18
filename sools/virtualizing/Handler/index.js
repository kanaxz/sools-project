const utils = require("../utils")
const Options = require("./Options")
const Reference = require("./Reference");
const Property = require("../Source/enum/Property")
const Var = require("../Source/enum/Var")
//const Virtual = require("../Virtual")

var id = 0;
class Handler {
	constructor(options){
		this.id  = id++
		this.virtual = options.virtual;
		if(!this.virtual){
			debugger
			throw new Error()
		}
		this.source = options.source
		if(!this.source){
			debugger
			throw new Error();
		}
		this.typeName = this.virtual.constructor.typeName;
		this.ref = options.ref || new Reference();
		this.ref.type = this.virtual.constructor;
		var scope = options.scope
		if(!scope)
			scope = this.source.scope;
		if(this.source instanceof Var){
			if(!scope){
				debugger
				throw new Error("Scope not found")
			}
			scope.vars.push(this);
		}
		this.scope = scope;
	}	

	get template(){
		return this.constructor.template;	
	}

	static get template(){
		return this.virtual.template
	}

	clone(options){
		options = options || {}
		if(!options.ref)
			options.ref = this.ref;
		if(!options.source)
			options.source = this.source;
		if(!options.scope){
			if(options.source && options.source.scope)
				options.scope = options.source.scope
			else
				options.scope = this.scope;
		}
		
		options = new Options(options);
		return new (this.cloneConstructor())(options);
	}

	cloneConstructor(){
		return this.constructor.virtual;
	}

	setProperty(property,value){
		Handler.set.call(this.scope,[this,property.name,value])
	}

	getProperty(property){
		var source = new Property({
			source:this,
			path:property.name
		});
		var args = property.type.handler.callAsProperty(this.scope, property,this.ref.refs[property.name]);
		//this.scope.processArg(this)
		var virtual = new property.type(new Options({
			source,
			scope:this.scope,
			...args,
			ref:this.ref.refs[property.name]
		}))

		this.ref.refs[property.name] = virtual._handler.ref;
		return virtual;
	}

	static callAsProperty(){
		return {};
	}

	static buildArg(scope,args,arg, description){
		debugger
		return scope.parse(arg);
	}

	static parse(scope, value){
		return new this.virtual(new Options({
			scope,
			source:value
		}))
	}


	toJSON(){
		if(!this.source){
			debugger
			throw new Error()
		}
		if(this.source.toJSON){
			return this.source.toJSON()	
		}
		else{
			return this.source
		}
	}

	static cast(arg){
		return false
	}
/*
	static build(scope,arg){
		return new this(scope,arg);
	}
/**/

}




/**/
module.exports = Handler;