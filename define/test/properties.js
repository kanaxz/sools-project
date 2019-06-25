var expect = require("chai").expect;

var Propertiable = require("../Propertiable");
var Properties = require("../Properties");
var Values = require("sools/Values");
var sools = require("sools");

var Test = sools.define([Propertiable()], (baseClass) => {
    return class Test extends baseClass {
        constructor(values) {
            super(new Values(values))
        }
    }
}, [
    new Properties({
        prop1: Properties.types.string()
    })
])


describe("Properties", function() {

    it("instance",function(){
        var prop = new Properties.types.object({
            name:'test'
        })

        expect(prop instanceof Properties.types.object).to.equal(true)
    })

    it("Properties 1 dimension", function() {
        var test = new Test({
            prop1: 'test1'
        })
        expect(test.prop1).to.equal('test1')
    });
    it("Properties 2 dimension", function() {

        var Test2 = sools.define(Test, (baseClass) => {
            return class Test2 extends baseClass {

            }
        }, [
            new Properties({
                prop2: Properties.types.string()
            })
        ])

        var test = new Test2({
            prop1: 'test1',
            prop2: 'test2'
        })

        expect(test.prop1).to.equal('test1')
        expect(test.prop2).to.equal('test2')
    });

    it("Building", function() {
        var test = Test.build({
            prop1: 'test1'
        })
        expect(test.prop1).to.equal('test1')
    })
    /**/
});