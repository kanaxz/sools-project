var expect = require("chai").expect;

var sools = require("sools");
var BindableFunctions = require("../BindableFunctions");
var Event = require("sools/Event");

describe("BindableFunctions", function() {
    it("try with event", function() {

        var Test = sools.define([BindableFunctions], (base) => {
            return class Test extends base {

                constructor() {
                    super();
                    this.event = new Event();
                    this.callbackCount = 0;
                }

                listen() {
                    this.event.listen(this.b(this.callback));
                }

                remove() {
                    this.event.remove(this.b(this.callback))
                }

                trigger() {
                    this.event.trigger();
                }

                callback() {
                    this.callbackCount++;
                }
            }
        })
        var test = new Test();
        test.listen();
        test.trigger();
        test.remove();
        test.trigger();
        expect(test.callbackCount).to.equal(1);
    });
});