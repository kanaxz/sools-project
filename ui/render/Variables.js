
const Tree = require("sools/Tree");
class Variables extends Tree {
    constructor() {
        super()
    }

    set() {
        if (typeof(arguments[0]) == "object") {
            var variables = arguments[0];
            for (var variableName in variables) {
                this.set(variableName, variables[variableName]);
            }
        } else if (typeof(arguments[0]) == "string" && arguments.length == 2) {
            var name = arguments[0];
            var value = arguments[1];
            var existing = this.getByName(name);
            if(existing){
              //throw new Error(`Variable '${name}'' already exists`);
            }
            this.push([name, value]);
        }
    }

    getByName(name) {
        return this.find((variable) => {
            return variable[0] == name;
        })
    }
}

module.exports = Variables;