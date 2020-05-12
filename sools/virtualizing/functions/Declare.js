const Function = require("../Source/enum/Function")
const Virtual = require("../Virtual");
const String = require("../Virtual/enum/String")

module.exports = new Function({
	name:'declare',
	args:[String,Virtual]
})