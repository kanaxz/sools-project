var expect = require("chai").expect;
console.log('wtf')
var sools = require("sools");
var Query = require("../Query");
var Properties = require("sools-define/Properties");
var Instances = require("sools-define/Instances");
var Types = require("sools-define/Types");
var Values = require("sools/Values");
var Event = require("sools/Event");
var Model = require("../Model");
var ModelType = require("../ModelType");
var Condition = require("../Condition");
var conditions = require("../conditions");
describe("querying building", function() {
    it("queries", function() {
        /*
        var Test = sools.define(Model, (base) => {
            class Test extends base {

            }

            return Test;
        }, [
            new Properties({
                prop1: Properties.types.string()
            }),
            new ModelType('test')
        ])

        var queries = Queries.build({
            content: [{
                type: {
                    name: 'get'
                },
                values: {
                    modelType: {
                        name: 'test'
                    },
                    condition: {
                        type: {
                            name: 'and'
                        },
                        values: {
                            content: [{
                                type: {
                                    name: 'equal'
                                },
                                values: {
                                    propertyName: 'prop1',
                                    value: 'test'
                                }
                            }]
                        }
                    }
                }
            }]
        }, [
            new Types(Condition, conditions.content),
            new Instances(ModelType, [Test.type]),
            new Types(Model, [Test]),
            new Types(Query, [queryTypes.get])
        ])
        
        expect(queries.length).to.equal(1)
        var query = queries[0];
        expect(query instanceof queryTypes.get).to.equal(true)
        expect(query.modelType).to.equal(Test.type)
        expect(query.modelType.name).to.equal("test")
        expect(query.condition[0] instanceof conditions.and)
        expect(query.condition[0][0] instanceof conditions.equal)
        /**/
    });


     it("and", function() {
       
     })
});


