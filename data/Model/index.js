var sools = require("sools");
var Typeable = require("sools-define/Typeable");
var Type = require("./Type");
var Propertiable = require("sools-define/Propertiable");
var Identifiable = require("sools-define/Identifiable");
var Values = require("sools/Values");
const Association = require("./Association");
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