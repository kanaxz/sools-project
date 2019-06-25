var expect = require("chai").expect;

var sools = require("sools");
var Context = require("sools/process/Context");
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
            (context, next) => {
            	context.components.push(new Number(5))
            	return next();
            }, (context, next) => {

            }))
        var setupContext = new Context();
        return flow.setup(setupContext,()=>{
        	return Promise.resolve(0)
        }).then(()=>{
        	
        	var number = setupContext.components.get(Number);
        	expect(number.value).to.equal(5)
        	return 0
        })

    });

});