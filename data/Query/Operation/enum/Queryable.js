var sools = require("sools")
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Operation = require("../index");
const arrayUtils = require("sools/Array/utils");
module.exports = sools.mixin([Propertiable()], (base) => {

    class Queryable extends base {
        constructor(...args) {
            super(...args);
            this.operations = [];
        }

        operation(operation) {
            this.operations.push(operation);
            return (this);
        }

        processResult(modelInterface, result, final) {
            return arrayUtils.chainBackward(this.operations, (operation, next, result) => {
                return operation.processResult(modelInterface, result, next);
            }, final, {
                args: [result]
            })
        }

        resultToJSON(type, result) {
            return arrayUtils.chainBackward(this.operations, (operation, next, result) => {
                return operation.resultToJSON(type, result, next);
            }, (results) => {
                return results.map((result) => {
                    return result.toJSON()
                })
            }, {
                args: [result]
            })
        }
    }

    return Queryable;
}, [
    new Properties({
        operations: Properties.types.array({
            type: Operation
        })
    })
])