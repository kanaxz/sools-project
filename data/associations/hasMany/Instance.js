const sools = require("sools");
const Array = require("sools-define/Array");
const Models = require("../../Models");
module.exports = sools.define(Models, (base) => {
    class HasMany extends base {
        constructor(property) {
            super();
            this.property = property;
            this.isLoaded = false;
        }
        
        get modelType() {
            return this.property.type;
        }

        loaded() {
            this.isLoaded = true;
        }

        attach(model) {
            this.model = model;
            this.throughModelInterface = this.model.modelInterface.modelInterfaces.get(this.property.through.type)
            //this.modelInterface = this.model.modelInterface.modelInterfaces.get(this.property.type);
        }

        toJSON() {
            return this.content;
        }

        add(models) {
            return this.throughModelInterface.add(models.map((model) => {
                return {
                    [this.property.through.other]: model,
                    [this.property.through.this]: this.model.identity()
                }
            }))
        }

        remove() {
            return this.throughModelInterface
                .delete()
                .where({
                    [this.property.through.this]: this.model.identity()
                }) 
                .target(this.property.through.other)
        }

        get() {
            return this.throughModelInterface
                .get()
                .where({
                    [this.property.through.this]: this.model.identity()
                })
                .target(this.property.through.other);
        }
    }

    return HasMany;
})