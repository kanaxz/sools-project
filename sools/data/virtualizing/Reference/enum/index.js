var Vars = require("./Var/enum")
var Enum =  [
	require("./Function"),
	require("./Var")
]

for(var reference of Enum){
	Enum[reference.type.name] = reference;
}

for(var varName in Vars){
	Enum[varName] = Vars[varName];
}



module.exports = Enum;