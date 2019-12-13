var Types = require("./Property/types");
var Tree = require("../Tree");
const Property = require("./Property");
class Properties extends Tree {
    constructor(...args) {
        super();
        this.push(...args);
    }

    push(...args) {
        for (var arg of args) {
            if (arg instanceof Properties) {
                super.push(arg);
            } else if (arg instanceof Property) {
                super.push(arg);
            } else if (arg instanceof Array) {

            } else if (typeof(arg) == "string") {
                super.push(new Types.any({
                    name: arg
                }))
            } else {
                for (var propertyName in arg) {
                    var obj = arg[propertyName];
                    var property;
                    if (obj.propertyTypeProxy === true) {
                        property = new(obj.type)(...obj.parameters);
                    } else if (typeof(obj) == "object") {
                        property = new Types.any(obj);
                    } else {
                        var handlers = Properties.handlers;
                        var handler;
                        for (var i = handlers.length - 1; i >= 0; i--) {
                            handler = handlers[i];
                            if (handler.handle(propertyName, obj))
                                break;
                        }
                        property = handler.build(propertyName, obj);
                    }
                    property.name =  propertyName
                    super.push(property);
                }
            }

        }
    }

    get(arg) {
        if(arg  instanceof Array){
            return this.filter((property) => {
                    return arg.indexOf(property.name) != -1;
            })
        }
        else{
            return this.find((obj) => {
                return obj.name == arg;
            })   
        }
        
    }
}

Properties.handlers = [{
    handle: (propertyName, obj) => {
        return true;
    },
    build: (propertyName, obj) => {
        console.log(propertyName)
        return new Types.object({
            name: propertyName,
            type: obj
        });
    }
}, {
    handle: (propertyName, obj) => {
        return obj instanceof Array
    },
    build: (propertyName, obj) => {
        return new Types.any({
            name: propertyName,
            types: obj
        })
    }
}]

Properties.types = Types;

module.exports = Properties;