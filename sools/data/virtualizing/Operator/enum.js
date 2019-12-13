var operators = [
    require("./Conditional/Or"),
    require("./Conditional/And"),
    ...require("./Relational/enum")
]

operators.register = function(operatorType) {
    var name = operatorType.type.name;
    if (this[name])
        throw new Error(`Conditon type name '${name}' not available`)
    this[name] = new Proxy(operatorType, {
        apply: (target, thisArg, args) => {
            return {
                isOperatorProxy: true,
                type: target,
                args: args
            }
        }
    });
} 

for (var operatorType of operators) {
    operators.register(operatorType);
}


global.$op = operators;
global.AND = operators.and;
global.OR = operators.or;
module.exports = operators;