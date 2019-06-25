var renderer = require("./render/renderer");
var Scope = require("./render/Scope");
var BaseScope = require("./render/BaseScope");
var Base = require("sools/Base");
const BindableFunctions = require("sools-define/BindableFunctions");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const sools = require("sools");
const Definition = require("./Definition")

class temp extends HTMLElement {

}

module.exports = sools.define(Base.mixin(temp), [BindableFunctions(), Propertiable()], (base) => {

    class Control extends base {
        static define(args) {

            super.define(args);
            var definition = args.find((arg) => {
                return arg instanceof Definition
            });
            if (definition) {
                this.definition = definition;
                if (this.definition.name)
                    customElements.define(this.definition.name, this);
            }


        }

        get definition() {
            return this.constructor.definition;
        }


        constructor() {
            super();
            this.isInitialized = false;
            this.isInitializing = false;
            this.parentScope = null;
            this.scope = new Scope(this);
            var constantes = this.constructor.definition.constantes
            if (constantes)
                this.scope.variables.set(constantes)
        }

        processed(parentScope) {
            return this.attach(parentScope);
        }

        attach(arg) {
            var parentScope;
            if (arg instanceof BaseScope)
                this.parentScope = arg;
            else if (arg instanceof Control)
                this.parentScope = arg.scope;
            else {
                //throw new Error("Cannont retrieve scope");
            }
            return this.initialize();
        }


        /**
            @protected
        */
        initialize() {
            if (this.isInitializing || this.isInitialized)
                throw new Error();
            this.isInitializing = true;
            return this.initializeContent()
                .then(() => {
                    if (this.definition.template)
                        return this.initializeTemplate();
                })
                .then(() => {
                    return this.initialized()
                })
        }

        initializeContent() {
            if (this.definition.transclude) {
                this.transcludeContent = [];
                this.childNodes.forEach((n) => {
                    this.transcludeContent.push(n);
                })
                return Promise.resolve(0);
                //return renderer.renderContent(this, this.parentScope)
            } else
                return renderer.renderContent(this, this.scope)
        }

        /**
        Has to be called from custom code, but not necessarily in the constructor
        
            @memberof whitecrow.control
            @instance
            @method initializeTemplate
            @protected
		*/
        initializeTemplate() {
            if (!this.definition.template)
                throw new Error("The control '" + this.definition.name + "' hasn't a template");
            this.innerHTML = this.definition.template;
            return renderer.renderContent(this, this.scope)
                .then(() => {
                    if (this.definition.transclude) {
                        var container = this.transcule || this;
                        this.transcludeContent.forEach((n) => {
                            container.appendChild(n);
                        })
                        return renderer.renderContent(container, this.parentScope)
                    }
                    return null;
                })
        }

        /**
			Called when the control is ready.
			If it has a template, it means it has been loaded and processed
			Can be overridden, but super method must be called
			@memberof whitecrow.control
 			@instance
			@method initialized
			@protected
			@fires web.events.initialized
		*/
        initialized() {
            if (this.isInitialized == true || !this.isInitializing)
                throw new Error("Cannot initialize control");
            this.isInitializing = false;
            this.isInitialized = true;
            return Promise.resolve(0);
        }

        event(name, arg) {
            var event = new CustomEvent(name, {
                bubbles:true,
                'detail': arg
            });
            return this.dispatchEvent(event);
        }

        /**
			@memberof whitecrow.control
 			@instance
			@method connectedCallback
			@protected
		*/
        connectedCallback() {}

        /**
			Destroy current element
			It will automatically call destructor from the renderer destroy process
			@memberof whitecrow.control
 			@instance
			@method destroy
			@public
		*/
        destroy() {
            renderer.destroy(this);
        }

        /**
			Called when the control is no more used
			@memberof whitecrow.control
 			@instance
			@method destructor
			@protected
		*/
        destructor() {
            for (var i = 0; i < this.childNodes.length; i++) {
                var childNode = this.childNodes[i];
                renderer.destroy(childNode);
            }
        }

        /**
			@memberof whitecrow.control
 			@instance
			@method disconnectedCallback
			@protected
		*/
        disconnectedCallback() {}
    }
    return Control;
}, [
    new Properties('isInitialized')
])