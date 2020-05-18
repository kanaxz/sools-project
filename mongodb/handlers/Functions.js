const Query = require("../virtuals/Query")
const Path = require("../virtuals/Path")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Expression = require("../virtuals/Expression")
const MongoScope = require("../Scope")
const Switch = require("../virtuals/SwitchExpression")
const Handler = require("./Handler");
const Unhandleable = require("sools/executing/Unhandleable")

module.exports = class Functions extends Handler {
	async  processFunctionCall(scope, functionCall){
		if(scope instanceof MongoScope){
			if(this[functionCall.function.name])
				return await this[functionCall.function.name](scope,functionCall)
		}
	} 

	async delete(scope,functionCall){
		var root = await utils.getRoot(scope, functionCall.args[0]);
		var propertyName = await scope.getValue(functionCall.args[1])
		var split = root.path.split(".")
		split.shift()
		root.query.pipeline.push({
			$unset:[...split,propertyName].join(".")
		})
		debugger
		return null;
	}

	async set(scope,functionCall){
		throw new Unhandleable()
	}

	async not(scope, functionCall){
		return new Expression({
			$not:await scope.getValue(functionCall.args[0])
		})
	}

	async if(scope,functionCall){
		var child = utils.childScope(scope);
		scope.switch = new Switch();
		scope.switch.branche({
			case:await scope.getValue(functionCall.args[0]),
			then:await child.process(functionCall.args[1].source.scope)
		})
		return null
	}

	async elseif(scope,functionCall){
		var child = utils.childScope(scope);
		scope.switch.branche({
			branches:[{
				case:await scope.getValue(functionCall.args[0]),
				then:await child.process(functionCall.args[1].source.scope)
			}]
		})
		return null
	}

	async else(scope,functionCall){
		var child = utils.childScope(scope);
		scope.switch.default(await child.process(functionCall.args[0].source.scope))
		return null
	}

	async return(scope,functionCall){
		if(scope.switch){
			if(scope.switch.$switch.default)
				throw new Error();
			scope.switch.default(await scope.getValue(functionCall.args[0]))
			var swtch = scope.switch
			delete scope.switch
			return swtch
		}
	}
}