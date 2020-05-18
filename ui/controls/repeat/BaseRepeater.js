var Control = require("../../Control");
var renderer = require("../../render/renderer");
const sools = require("sools");
const Properties = require("sools/Propertiable/Properties");
const Array = require("sools/Array")
const ArrayHandler = require("./handlers/Array");
const ObservableArrayHandler = require("./handlers/ObservableArray");

module.exports = sools.define(Control, (base) => {


    class BaseRepeater extends base {

        static getHandlerType(object) {
            for (var i = this.builders.length - 1; i >= 0; i--) {
                var builderType = this.builders[i];
                if (builderType.handle(object))
                    return builderType;
            }
            return null;
        }

        constructor() {
            super();
            this.container = this;
            this.iterations = [];
            this.as = "object";
        }

        initialized() {
            return super.initialized().then(()=>{
                return this.refresh();    
            })        
        }

        clear() {
            while (this.iterations[0])
                this.destroyIteration(this.iterations[0])
        }

        sourceChanged(oldSource) {
            if (oldSource) {
                this.builder.destroy();
                this.clear();
            }
            if (this.source) {
                var builderType = this.constructor.getHandlerType(this.source);
                if (!builderType)
                    throw new Error("");

                this.builder = new builderType(this, this.source);

            }
            this.refresh();
        }

        // mut be override by subclasses
        buildElement(it) {
            throw new Error("You must override the 'buildElement' method from '" + this.constructor.name + "' class");
        }

        /**
          @virtual
        */
        getContainer() {
            return this;
        }

        canBuild() {
            return this.source && this.isInitialized
        }

        processIteration(it) {
            this.buildElement(it);
            var scope = this.parentScope.child();
            scope.variables.set(this.as, it.object);
            scope.variables.set(this.as == "object" ? "it" : this.as + "It", it);
            it.scope = scope;
            this.iterations.push(it);
            return (it);
        }

        insertIteration(it) {
            var container = this.getContainer();
            container.appendChild(it.element);
            return renderer.render(it.element, it.scope);
        }

        processAndInsertIteration(it) {
            this.processIteration(it);
            return this.insertIteration(it);
        }

        destroyIteration(it) {
            var index = this.iterations.indexOf(it);
            if (index == -1)
                throw new Error("");

            this.container.removeChild(it.element);

            //renderer.destroy(it.element);
            
            this.iterations.splice(index, 1)
        }


        refresh() {
            
            if (!this.canBuild())
                return;

            this.clear();
            return this.builder.forEach((it) => {
                return this.processAndInsertIteration(it);
            })

        }

        destructor() {
            super.destructor();
        }


    }
    BaseRepeater.builders = [
        ArrayHandler,
        ObservableArrayHandler
    ];
    return BaseRepeater;
}, [
    new Properties({
        source: {
            onSet: function(newValue, oldValue) {
                this.sourceChanged(oldValue);
            }
        }
    })
])