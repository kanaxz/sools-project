const utils = require("../utils")
const Options = require("./Options")
const Reference = require("./Reference");
const Statement = require("../Statement");
const Sources = require("../Source/enum/")
const Assignment = require("../functions/Assignment")

var id = 0;
class Handler {
	constructor(options){
		var source = options.source;
		this.id  = id++
		this.virtual = options.virtual;
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
			source = new Sources.var(source);
		}

		var scope = options.scope
		if(!scope)
			scope = source.scope;
		if(source instanceof Sources.var){
			if(!scope.vars)
				debugger
			scope.vars.push(this);
		}
		this.scope = scope;
		this.source = source;
		
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

	processSource(arg){
		if(arg.source instanceof Sources.functionCall){	
			if(arg.scope == arg.scope.target && arg.source == arg.scope.lastStatment.functionCall){
				arg.scope.statements.splice(-1,1)
				arg.scope.removedStatements.push({
					index:arg.scope.statements.length,
					statement:arg.source.statement
				})	
			}		
			else{
				var removedStatement = arg.scope.removedStatements.find((rs)=>rs.statement.functionCall == arg.source);
				if(removedStatmentIndex){
					var index = arg.scope.removedStatements.indexOf(removedStatement);
					arg.scope.statements.splice(index,0,removedStatement.statement);
					arg.scope.removedStatements.splice(index,1)
				}
				var variable = this.clone({
					source:utils.gererateVariableId(),
					scope:arg.scope
				});
				var index = arg.scope.statements.indexOf(arg.source.statment);
				if(index == -1)
					throw new Error()
				arg.scope.statements.splice(index,1,new Statment(new Sources.functionCall({
					scope:arg.scope,
					function:Assignment,
					args:[this.clone({scope:arg.scope,source: arg.source}),variable]
				})));
				arg.source = variable._handler.source;
			}
		}		
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
		return new this.virtual(arg);
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

module.exports = Handler;