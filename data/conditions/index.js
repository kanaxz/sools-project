var conditions = [
    require("./Equal"),
    require("./And"),
    require("./Or"),
    require("./Like")
]

var proxy = {
    content: conditions,
    register: function(conditionType) {
        var name = conditionType.type.name;
        if (this[name])
            throw new Error(`Conditon type name '${name}' not available`)
        this[name] = new Proxy(conditionType, {
            apply: (target, thisArg, args) => {
                return {
                    isConditionProxy: true,
                    type: target,
                    args: args
                }
            }
        });
    }
}

for (var conditionType of conditions) {
    proxy.register(conditionType);
}

module.exports = proxy;