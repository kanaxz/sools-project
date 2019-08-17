var sools = require("sools");
var Propertiable = require("sools-define/Propertiable");
var Type = require("./Type");
var Typeable = require("sools-define/Typeable");
var Propertiable = require("sools-define/Propertiable");
var Properties = require("sools-define/Properties");
var Values = require("sools/Values");
var sools = require("sools");
const Type = require("sools-define/Type");

var VarType = sools.define([Propertiable(), Type()], (base) => {
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

var Var = sools.define([Propertiable(), Typeable(VarType)])

Var.enum = {
	col:new Properties({
		propertyName:Properties.types.string()
	})
}

for(var typeName in Operator.enum)
	Var.enum[typeName] = sools.define(Var,[Var.enum[typeName],new VarType(typeName)]);

module.exports = Var;
