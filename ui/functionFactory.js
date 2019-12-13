var utilities = require("./utilities");
var cachedFunctions = [];
/**
https://stackoverflow.com/questions/4025893/how-to-check-identical-array-in-most-efficient-way
*/
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}


function getFunctionByFunctionArgs(functionArgs) {
    for (var i = 0; i < cachedFunctions.length; i++) {
        var cachedFunction = cachedFunctions[i];
        if (arraysEqual(cachedFunction.functionArgs, functionArgs)) {
            return cachedFunction.fn
        }
    }
    return null;
}

var functionFactory = {
    /**
        @description Create a functions in which the variables initialization is added before the function content
        @method createFunction
        @memberof whitecrow.utilities
        @public
        @static
        @param {Object} variables
        @param {string} functionContent
        @return {function}
    */
    createFunction: function(variables, functionContent) {

        return function() {
            var functionArgs = [];
            var variablesArgs = [];
            if (variables) {
                for (var variable of variables) {
                    functionArgs.push(variable[0]);
                    variablesArgs.push(variable[1]);
                }
            }
            functionArgs.push(functionContent);
            var fn = getFunctionByFunctionArgs(functionArgs);
            if (fn == null) {
                try {
                    fn = Function.apply(null, functionArgs);
                    cachedFunctions.push({
                        functionArgs: functionArgs,
                        fn: fn
                    })

                } catch (e) {
                    throw new Error("Error in function " + functionContent + "\" : " + e.message);
                }
            }

            return fn.apply(this, variablesArgs);

        };
    }
}

module.exports = functionFactory;