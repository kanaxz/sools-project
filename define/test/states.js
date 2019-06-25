return
var expect = require("chai").expect;

var Properties = require("sools/Properties");
var Values = require("sools/Values");
var Entity = require("sools/Entity");
var Event = require("sools/Event");
var StatesBehavior = require("sools/define/States/Behavior");
var States = require("sools/define/States");

class Test extends Entity {
    constructor(values) {
        super(new Values(values));
    }
}

Test.behaviors = [
    new Properties({
        prop1: Properties.types.string(),
        prop2: Properties.types.string()
    }),
    new StatesBehavior()
];

describe("States", function() {
    it("dirty property", function() {
        var test = new Test({
            prop1: 'test1'
        })

        var states = test.components.get(States);
        expect(states.get('prop1')).to.equal(States.enum.clean);
        test.prop1 = "newValue";
        expect(states.get('prop1')).to.equal(States.enum.dirty);
    });

});