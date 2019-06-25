var baseMixin = (base) => {
    class Base extends base {
        static define(definitions) {
            /*
            if(!definitions.length)
                return;
            /**/
            var Definitions = DefaultBase.circular.definitions;
            if(!Definitions)
                throw new Error("What");
        	if(!(definitions instanceof Definitions)){
        		definitions = new Definitions(...definitions);
        	}
            
            if (this.definitions)
                definitions.push(this.definitions)
            this.definitions = definitions;
        }
    }

    return Base
}

DefaultBase = baseMixin(class {});
DefaultBase.circular = {};
DefaultBase.mixin = baseMixin;
module.exports = DefaultBase;