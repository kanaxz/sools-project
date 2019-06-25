var expect = require("chai").expect;

var sools = require("sools");
var Context = require("sools/process/Context");
var Trigger = require("sools/process/Trigger");
var Dynamic = require("sools/process/Dynamic");
var Builder = require("sools/process/Builder");
var Propertiable = require("sools/define/Propertiable");
var Properties = require("sools/define/Properties");
var Typeable = require("sools/define/Typeable");
var Values = require("sools/define/Values");
describe("Builder", function() {
    it("setup and execute", function() {

        var BottomType = sools.define([Propertiable()], (base) => {
            return class BottomType extends base {
                constructor(name) {
                    super(new Values({
                        name: name
                    }))
                }
            }
        }, [
            new Properties({
                name: Properties.types.string()
            })
        ])


        var BaseBottom = sools.define([Propertiable(), Typeable(BottomType)], (base) => {
            return class BaseBottom extends base {}
        })

        var Bottom1 = sools.define(BaseBottom, (base) => {
            return class Bottom1 extends base {}
        }, [
            new Properties({
                prop: Properties.types.string()
            }),
            new BottomType('bottom1')
        ])

        var Bottom2 = sools.define(BaseBottom, (base) => {
            return class Bottom2 extends base {}
        }, [
            new Properties({
                prop: Properties.types.string()
            }),
            new BottomType('bottom2')
        ])


        var Top = sools.define([Propertiable()], (base) => {
            return class Top extends base {}
        }, [
            new Properties({
                mainBottom: BaseBottom,
                bottoms: Properties.types.array({
                    type: BaseBottom
                })
            })
        ])

        class Data {
            constructor(content) {
                this.content = content;
            }
        }

        var context = new Context();
        context.components.push(new Data({
            mainBottom: {
                type: {
                    name: 'bottom1'
                },
                values: {
                    prop: 'test1'
                }
            },
            bottoms: [{
                type: {
                    name: 'bottom2'
                },
                values: {
                    prop: 'test2'
                }
            },{
                type: {
                    name: 'bottom1'
                },
                values: {
                    prop: 'test3'
                }
            }]
        }))
        var trigger = new Trigger();
        trigger
            .then(new Builder({
                source: (context) => {
                    return context.components.get(Data).content;
                },
                type: Top
            }))
            .then(new Dynamic((context, next) => {
                context.components.push(Bottom1, Bottom2)
                return next();
            }))


        return trigger.setup(new Context()).then(() => {
            return trigger.execute(context)
        }).then(() => {
            var top = context.components.get(Top);
            expect(top.mainBottom instanceof Bottom1).to.equal(true)
            expect(top.bottoms[0] instanceof Bottom2).to.equal(true)
            expect(top.bottoms[1] instanceof Bottom1).to.equal(true)
        })
    });
});