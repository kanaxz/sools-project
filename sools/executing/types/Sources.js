const Handler = require("../Handler");
const Functions = require("../../virtualizing/functions")

var SourcesProcess = {
	property:async (scope, arg)=>{
		return (await scope.getValue(arg.source.source))[arg.source.path]
	},
	var:async (scope,arg)=>{
		return await scope.getValue(arg)
	}
}

module.exports = class FunctionsHandler extends Handler {

	async processArg(scope,arg){
		if(SourcesProcess[arg.source.constructor.name.toLowerCase()])
			return await SourcesProcess[arg.source.constructor.name.toLowerCase()](scope,arg)
	}
}