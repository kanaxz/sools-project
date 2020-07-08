const regex = /(^[0-9]+\/)?([0-9]+\+?)(\([0-9]+-[0-9]+\))?(\(x[0-9]+\))?/
const moment = require("moment");
module.exports = {
  parse(string) {
    var r = regex.exec(string)
    
    var result = {};
    if(r[1]){
    	result.currentLevel = {
    		date:new Date(),
     		value:parseInt(r[1].replace("/",''))
    	}
    }
    if(r[2]){
    	result.maxLevel = {
    		plus:r[2].indexOf("+") != -1,
    		value:parseInt(r[2].replace("+",""))
    	}
    }
    if(r[3]){
    	var split = r[3].substring(1,r[3].length - 1).split("-");
    	result.gather = {
    		tool:parseInt(split[0]),
    		ressource:parseInt(split[1])
    	}
		}    	
		if(r[4]){
			result.quantity = parseInt(r[4].substring(1,r[4].length - 1).replace("x",""))
		}		
    return result
  },
  buildCurrentValue(ressource) {
  	if(ressource.currentLevel && ressource.currentLevel.value == -1)
  		return '';
    var currentLevel
    var approximatif = false;
    var max = false;
    if (ressource.currentLevel) {
      if (ressource.currentLevel.date) {
        var duration = moment().diff(moment.utc(ressource.currentLevel.date), 'minutes')
        approximatif = true
        currentLevel = ressource.currentLevel.value + parseInt(duration / 10)
      } else {
        currentLevel = ressource.currentLevel.value;

      }
    } else {

    }
    if (ressource.maxLevel && currentLevel >= ressource.maxLevel.value) {
      max = true;
      currentLevel = ressource.maxLevel.value
    }

    return currentLevel && currentLevel + "/" || ''
  },

  build(ressource){
  	console.log("RESSOURCE",ressource)
  	return this.buildCurrentValue(ressource) + (ressource.maxLevel && (ressource.maxLevel.value + (ressource.maxLevel.plus ? '+' :'')) || '') + (ressource.gather && `(${ressource.gather.tool}-${ressource.gather.ressource})` || '') + (ressource.quantity && '(x' + ressource.quantity + ")" || '')
  }
}