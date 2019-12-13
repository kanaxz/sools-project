var sools = require("../../../../sools");
var Propertiable = require("../../../../propertying/Propertiable");
var Properties = require("../../../../propertying/Properties");
const RelationalOperator  = require("./index")
const Type = require("../Type")
const Var =  require("../../Var")

var rop = {
	eq:new Properties({
		value:Var
	})
}

var result = [];
for(var opName in rop)
	result.push(sools.define(RelationalOperator,[rop[opName],new Type(opName)]))

module.exports = result;
