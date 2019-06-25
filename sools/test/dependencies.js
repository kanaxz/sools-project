var expect = require("chai").expect;

var sools = require("../sools");
describe("Dependencies", function() {
    it("get dependency", function() {

        var TestMixin = sools.mixin((base) => {
            return class TestMixin extends base {}
        })

        var Test = sools.define([TestMixin()], (base) => {
            return class Test extends base {}
        });
        expect(Test.dependencies.has(TestMixin)).to.equal(true)
    });
});