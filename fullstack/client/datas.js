const Datas = require("sools/data/Datas");
const Context = require("sools/data/Context");
const constantes = require("../shared/constantes")
const RequestLauncher = require("sools-browser/RequestLauncher")
const models = require("../shared/models");

const AppDatas = class extends Datas {
	buildContext(){
		var context = new this.context.type()
		context.constantes = constantes;
		return  context;
	}

	execute(...args){
		if(args.length == 1){
			args.unshift(new this.context.type())
		}
		return super.execute(...args);
	}
}


var datas = new AppDatas({
  models,
  constantes
})

datas
  /**/
  .then((scope,next)=>{
  	//console.log(JSON.stringify(scope.scope,null,' '))
  	return next()
  })
  .then(new RequestLauncher({
  	source:(scope)=>{
  		return JSON.stringify(scope.scope);
  	},
  	url:'/datas',
  	type:'post'
  }))
/**/
module.exports = datas;