const sools = require("../../../../sools");
const Association = require("../../index");
const Instance = require("./Instance");
const HasOne = require("../HasOne");
const ModelInterfaces = require("../../../ModelInterfaces");

class HasMany extends Association {

    constructor(values) {
        super(values);
        this.setDefault = true;
        if(typeof(values) ==  "function"){
            this.type = values;
            this.through = null;
        }
        else{
            this.type = values.type;
            this.through = values.through;
        }
    }

    build(array, options) {
        var modelInterfaces = options.find((option)=>option instanceof ModelInterfaces)
        var modelInterface = modelInterfaces.get(this.type);
        var instance = modelInterface.modelsFactory.build(Instance, this);
        for (var result of array) {
            instance.push(this.type.build(result, options));
        }
        return instance;
    }

    attachType(ownerType) {
        super.attachType(ownerType);
        if(!this.through)
            this.through = this.ownerType.type.name;
    }

    modelAttached(model, instance) {
        instance.attach(model);
    }

    default() {
        return new Instance(this);
    }
}

module.exports = HasMany;