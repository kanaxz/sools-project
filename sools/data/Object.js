var sools = require("../../sools");
var Propertiable = require("../Propertiable");
const Data = require("./index")
const VObject = require("../virtualizing/Virtual/enum/Object")

module.exports = Data.defineType({
	type:sools.define([Propertiable()],(base)=>{
		return class Object extends base {

			constructor(values){
				super(values);
				this.default();
			}

			attach(datas){
				this.datas = datas;
			}
		}
	}),
	virtual:VObject
}) 

