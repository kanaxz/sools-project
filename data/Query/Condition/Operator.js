var sools = require("sools");
var Propertiable = require("sools-define/Propertiable");
var Type = require("./Type");
var Typeable = require("sools-define/Typeable");
var Propertiable = require("sools-define/Propertiable");
var Properties = require("sools-define/Properties");
var Values = require("sools/Values");
var sools = require("sools");
const Type = require("sools-define/Type");

var OperatorType = sools.define([Propertiable(), Type()], (base) => {
    class OperatorType extends base {
        constructor(name) {
            super(new Values({
                name: name
            }))
        }
    }

    return ConditionType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])

var Operator = sools.define([Propertiable(), Typeable(OperatorType)])

Operator.enum = {
	eq:new Properties({
		value:Properties.types.any()
	}),
	like:new Properties({
		value:Properties.types.any()
	}),
	in:new Properties({
		vars:Properties.types.array({type:Var})
	})
}

for(var opName in Operator.enum)
	Operator.enum[opName] = sools.define(Operator,[Operator.enum[opName],new OperatorType(opName)]);

module.exports = Operator;
