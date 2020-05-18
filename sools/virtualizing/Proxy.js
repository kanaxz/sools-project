module.exports = class Proxy {
	deleteProperty(instance,property){
		DELETE(instance[property])
	}	
}