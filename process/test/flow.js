var expect = require("chai").expect;

var sools = require("sools");
var Scope = require("sools/process/Scope");
var Dynamic = require("sools/process/Dynamic");
var Flow = require("sools/process/Flow");
describe("Flow", function() {
    it("setup and execute", function() {

    	class Number {
    		constructor(value){
    			this.value = value;
    		}
    	}

        var flow = new Flow();
        flow.then(new Dynamic(
            (scope, next) => {
            	scope.components.push(new Number(5))
            	return next();
            }, (scope, next) => {

            }))
        var setupScope = new Scope();
        return flow.setup(setupScope,()=>{
        	return Promise.resolve(0)
        }).then(()=>{
        	
        	var number = setupScope.components.get(Number);
        	expect(number.value).to.equal(5)
        	return 0
        })

    });

});