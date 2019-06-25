var expect = require("chai").expect;

var conditions = require("../conditions")

describe("querying", function() {
    it("conditions", function() {
    	var and = new conditions.and();
    	var andProxy = conditions.and();
    	expect(and instanceof conditions.and).to.equal(true)
    	expect(andProxy.isConditionProxy).to.equal(true)
    });
});