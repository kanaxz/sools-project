const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
const Field = require("../Field")
require("./index.scss");



module.exports = sools.define(Field, (base) => {
    class StringField extends base {

    	initialized(){
    		return super.initialized()
    			.then(()=>{

    			});
    	}
    }
    return StringField
}, [
    new Definition({
        name: "string-field",
        template: require("./index.html")
    })
])