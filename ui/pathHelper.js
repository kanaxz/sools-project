var mapping = {
  A: ['href'],
  IMG: ['src']
}
var handlers = [
  (node, property,value) => {
    if (['A', 'IMG'].indexOf(node.nodeName) != -1 && value == null && mapping[node.nodeName].indexOf(property) != -1) {
      node.removeAttribute(property)
      return true
    }
  },
  (node,property,value)=>{
  	if(node.nodeName && property == "style"){
  		for(var styleName in value){
  			node.style[styleName] = value[styleName]
  		}
  		return true
  	}
  }
 ]

var pathHelper = {
  set: function(object, pathString, value) {
    //if(object.nodeName =="IMG" && pathString == "src" && value == null)

    var splitted = pathString.split(".");
    var current = object;

    for (var i = 0; i < splitted.length - 2; i++) {
      current = current[splitted[i]];
    }
    if (!current) {
      debugger
      throw new Error()
    }
    var property = splitted[splitted.length - 1]
    var handler = handlers[current.nodeName]
    for(var handler of handlers){
    	if(handler(current,property,value)){
    		return
    	}
    }
    current[property] = value;
    return value;
  },

  get: function(object, pathString) {
    var splitted = pathString.split(".");
    var current = object;
    for (var i = 0; i < splitted.length; i++) {
      if (current == null)
        return null;
      current = current[splitted[i]];
    }
    return current;
  }
}


module.exports = pathHelper;