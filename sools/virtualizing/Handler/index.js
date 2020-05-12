const utils = require("../utils")
const Options = require("./Options")
const Reference = require("./Reference");
const Property = require("../Source/enum/Property")
const Var = require("../Source/enum/Var")
//const Virtual = require("../Virtual")

var id = 0;
class Handler {
	constructor(options){
		var source = options.source;
		this.id  = id++
		this.virtual = options.virtual;
		if(!this.virtual)
			debugger
		this.typeName = this.virtual.constructor.typeName;
		/*
		if(source && source.path)
			console.log(this.id,source.path,!!options.ref)
		/**/
		this.ref = options.ref || new Reference();
		this.ref.type = this.virtual.constructor;
		if(source == null)
			return
		
		if(this.typeName != "string" && typeof(source) == "string"){
			source = new Var(source);
		}
		/**/

		var scope = options.scope
		if(!scope)
			scope = source.scope;
		if(source instanceof Var){
			if(!scope.vars){
				debugger
				throw new Error("Scope not found")
			}
			scope.vars.push(this);
		}
		this.scope = scope;
		this.source = source;
		
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
		this.scope.env.workers.forEach((worker)=>{
			worker.onPropertyGet(property, this.virtual,virtual)
		})
		return virtual;
	}

	static callAsProperty(){
		return {};
	}

	static buildArg(scope,args,arg, description){
		return scope.parse([arg])
		//return new this.virtual(arg);
	}

	static parse(scope, value){
		return new this.virtual(new Options({
			source:value,
			scope
		}))
	}


	toJSON(){
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