var sools = require("../../sools");
var Type = require("./Type");
var Propertiable = require("../../propertying/Propertiable");
var Identifiable = require("../../propertying/identifying/Identifiable");
const Association = require("../Association");
module.exports = sools.define([
    Propertiable(),
    Identifiable()], 
(base) => {
    class Model extends base {
        static define(args){
            var type = args.find((arg) => {
                return arg instanceof Type;
            })
            if (type) {
                this.type = type;
                type.attach(this);
            }
            super.define(args);
        }

        get isAttached() {
            return this.modelInterface != null;
        }

        attach(modelInterface) {
            this.modelInterface = modelInterface;
            this.constructor.properties.forEach((property)=>{
                if(property instanceof Association)
                    property.modelAttached(this, this[property.name]);
            })
        }

        delete(){
            return this.modelInterface.delete().where(this).first();
        }
    }
    return Model;
})