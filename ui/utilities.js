/**
    @namespace whitecrow.utilities
*/

var functionFactory = require("./functionFactory");
var utilities = {

    forEachAsync: function(array, it) {
        var promise = new Promise(function(resolve, reject) {
            var work = function(i) {
                if (i < array.length) {
                    var next = function() {
                        work(i + 1)

                    };
                    var result = it(array[i], next);
                    if (result instanceof Promise) {
                        result.then(next);
                    }

                } else {
                    resolve();
                }
            }

            work(0);
        })
        return promise;

    },
    /**
        @description Wait for a control to be initialized
        @method waitInitialization
        @memberof whitecrow.utilities
        @public
        @static
        @param {whitecrow.control} control
        @return {Promise} result
        @listens web.events.event:initialized
    */
    waitInitialization: function(param) {
        if (param instanceof Array) {
            var controls = param;
            return this.forEachAsync(controls, function(control) {
                if (!(control instanceof whitecrow.control)) {
                    throw new Error("Object is not an instance of control");
                }

                return control.waitInitialization();
            });
        } else {
            var control = param;
            return new Promise(function(resolve, reject) {
                var preCallback = function() {
                    control.removeEventListener("initialized", preCallback);
                    resolve();
                };
                if (control.isInitialized) {
                    resolve();
                } else {
                    control.addEventListener("initialized", preCallback)
                }
            })
        }
    },
    /**
        @description Create a functions wrapper 
        @method createFunctionWrapper
        @memberof whitecrow.utilities
        @public
        @static
        @param {object} source - An object which will be binded to the function using 'bind'
        @param {object} variables - An object where the keys define the names of the values
        @param {string} functionContent
        @return {function}
    */
    createFunctionWrapper: function(object, variables, fnContent, functionParameters) {
        return () => {
            var fn = functionFactory.createFunction(variables, fnContent);
            return fn.call(object, variables.map((variable)=>{
                return variable[1]
            }));
        }
    }
}


module.exports = utilities;