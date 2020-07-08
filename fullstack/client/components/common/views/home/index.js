const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const EmptyLayout = require("layouts/empty")
require("./home.scss")

module.exports = sools.define(View, (base) => {
  class Home extends base {
    constructor() {
      super();
      
    }

    clicked(event){
    	console.log(this.ctx.isPointInPath(this.path,event.offsetX,event.offsetY))
    }


    async initialized(){
    	await super.initialized()
    	var ctx = this.canvas.getContext('2d');
    	this.ctx = ctx;

    	var path = new Path2D();
    	this.path = path
    	ctx.save()
    	ctx.translate(50,50)
    	path.moveTo(10,10)
    	path.lineTo(10,100)
    	path.lineTo(100,100)
    	path.lineTo(100,10)
    	path.closePath();
			ctx.stroke(path);
    }
  }

  return Home;
}, [
  new Properties(),
  new Definition({
    layout: MainLayout,
    name: "home-view",
    template: require("./home.html")
  })
])

/**/