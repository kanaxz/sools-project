const Function = require("../Source/enum/Function")
const Virtual = require("../Virtual");
const String = require("../Virtual/enum/String")
const Handler = require("../Handler")

const Set = new Function({
	name:'set',
	args:[Virtual,String,Virtual]
})

Handler.set = Set;
module.exports = Set;