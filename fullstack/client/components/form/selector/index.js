const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools/Propertiable/Properties");
const Control = require("sools-ui/Control")
const html = require("sools-ui/html");
require("./index.scss");

module.exports = sools.define(Control, (base) => {
  return class Selector extends base {

  	focus(){
  		this.active = true;
  		this.input.focus()	
  	}

  	async initialized(){
  		await super.initialized()

  		console.log(this.template.parentNode)
  		//this.template.parentNode.removeChild(this.template);
  	}

  	keyDown(e){
  		if([38,40].indexOf(e.keyCode) != -1){
  			var change =(e.keyCode == 38 ? -1 : 1)
  			if(this.selectedIndex + change < 0 || this.selectedIndex + change > this.filteredValues.length - 1)
  				return 
  			this.selectedIndex+= change
  			this.list.querySelector(`.wrapper:nth-child(${this.selectedIndex + 1})`).scrollIntoView(false)
  		}
  		else if(e.keyCode == 13){
  			e.preventDefault()
  			this.setValue(this.filteredValues[this.selectedIndex])
  			setTimeout(()=>{
	  			this.nextElementSibling.focus()	
	  		},1)
  		}
  	}

  	keyUp(e){
  		if([38,40].indexOf(e.keyCode) == -1)
  			this.updateValues()
  	}

  	itemClicked(item){
  		this.setValue(item);
  		setTimeout(()=>{
  			this.nextElementSibling.focus()	
  		},1)
  	}

  	setValue(value){
  		this.filteredValues = null
  		this.value = value;
  		this.active = false;
  	}

  	onBlur(event){
  		if(!this.active)
  			return
  		this.input.value = ""
  		this.active = false;
  	}

  	updateValues(){
  		
  		this.active = true;
  		this.input.focus()
  		setTimeout(()=>{
  			this.filteredValues = this.values.filter((value)=>{
	  			return value.startsWith(this.input.value);
	  		})
  			this.selectedIndex = 0;	
  		},1)
  		
  	}
  }
}, [
  new Properties('value','filteredValues','active','selectedIndex'),
  new Definition({
    name: "form-selector",
    template: require("./index.html")
  })
])