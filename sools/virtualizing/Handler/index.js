const utils = require("../utils")
const Options = require("./Options")
const Reference = require("./Reference");
const Statment = require("../Statment");
const Sources = require("../Source/enum/")

module.exports = class Handler {
	constructor(options){
		var source = options.source;
		this.virtual = options.virtual;
		this.typeName = this.virtual.constructor.typeName;
		this.ref = options.ref || new Reference();
		if(source == null)
			return

		if(this.typeName != "string" && typeof(source) == "string"){
			source = new Sources.var(source);
		}

		var scope = options.scope
		if(!scope)
			scope = source.scope;
		if(source instanceof Sources.var){
			scope.vars.push(this);
		}
		this.scope = scope;
		this.source = source;

	}

	clone(options){
		options = options || {}
		if(!options.ref)
			options.ref = this.ref;
		if(!options.scope)
			options.scope = this.scope;
		if(!options.source)
			options.source = this.source;
		options = new Options(options);
		return new (this.cloneConstructor())(options);
	}

	processSource(arg){
		
		if(arg.source instanceof Sources.functionCall){	

			debugger
			if(arg.source.statment == arg.scope.lastStatment){
				arg.scope.statments.find((statment)=>statment.function == source);
				return
				if(arg.scope == this.scope){
					sourceScope.statments.splice(-1,1)
					sourceScope.removedStatments.push({
						index:sourceScope.statments.length,
						functionCall:source
					})	
				}
				else{
					arg.scope.statments.find((statment)=>statment.function == source);
				}
				
			}
			else{

				var removedStatmentIndex = arg.scope.removedStatments.findIndex((rs)=>rs.functionCall == arg.source);
				if(removedStatmentIndex != -1){
					arg.scope.statments.splice(arg.scope.removedStatments[removedStatmentIndex].index,0,arg.source.statment);
					arg.scope.removedStatments.splice(removedStatmentIndex,1)
				}
				var variable = this.clone({
					source:utils.gererateVariableId(),
					scope:this.scope
				});
				var index = arg.scope.statments.indexOf(arg.source.statment);
				if(index == -1)
					throw new Error()
				arg.scope.statments.splice(index,1,new Statment({
					function:functions.assignation,
					args:[this.clone({scope:arg.scope,source: arg.source}),variable]
				}));
				arg.source = variable._handler.source;
			}
				/**/
		}
		
		else if(arg.source  instanceof Sources.property){
			if(arg.source.source)
				this.processSource(arg.source);
		}
		/**/
		return this;	
	}

	process(){
		return this.processSource(this);
	}

	cloneConstructor(){
		return this.constructor.virtual;
	}

	getProperty(property){


		var source = new Sources.property({
			source:this,
			path:property.name
		});
		var args = property.type.handler.callAsProperty(this.scope, property);
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

	static build(scope,arg){
		return new this(scope,arg);
	}

	static rootBuild(scope, arg){
		if(typeof(arg) == "object" && arg.type == "functionCall"){
			var statment = Statment.build(scope, arg);
			var split = arg.function.split(".");
			var method = scope.env.description.types[split[0]].methods[split[1]];
			return method.return(statment);
		}
		else if(typeof(arg) == "string" && arg[0] == "$"){
			var split = arg.split(".");
			var result = scope.getVar(split[0].replace("$",""));
			split.shift();
			for(var segment of split){
				result = result[segment]
			}
			return result;
		}
		else if(typeof(arg) == "object" && arg.source && arg.path){

		}
		else {
			var types = scope.env.description.types;
			for(var typeName in types){
				var type = types[typeName];
				if(type.class.cast(arg)){
					return type.class.build(scope,arg);
				}
			}			
		}
		return arg;
	}
}

