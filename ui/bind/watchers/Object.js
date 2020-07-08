const Watcher = require("./Watcher");
const Propertiable = require("sools/Propertiable");
class ObjectWatcher extends Watcher {

    static handle(object) {
        return true
    }

   buildPath(path){
   	var split = path.split(".");
   	var current=  this.object
   	for(let segment of split){
   		Object.defineProperty(current,segment,{
   			get:(object,path)=>{
   				if(path == segment)
   					return object["_" + path]
   				else
   					return object[path]
   			},
   			set:(object,path,value)=>{
   				if(path == segment)
   					object["_" + path] = value;
   				else
   					object[path] = value
   			}
   		})
   		Object.defineProperty(current,"_" + segment,{
   			enumerable: false,
   		})
   		current = current[segment]
   	}
   	return super.buildPath(path);
   }
}

module.exports = ObjectWatcher;