var Property = require("sools-define/Property");
class ObjectIdProperty extends Property {
	transform(owner, value){
		if(typeof(value) !="string")
			return value.toHexString();
		else
			return super.transform(owner, value);
	}
}

module.exports = ObjectIdProperty;

