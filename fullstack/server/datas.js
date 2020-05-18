const Datas = require("sools/data/Datas");
const Mongodb = require("sools-mongodb/Source");
const Controller = require("sools/data/virtualizing/workers/Controller")
const AutoLoad = require("sools/data/virtualizing/workers/AutoLoad")
const Load = require('sools/data/virtualizing/workers/Load')
const config = require("./config")
const Memory = require("sools/executing/Memory")
const controls = require("../shared/controls")
const models = require("../shared/models");
const constantes = require("../shared/constantes");

var datas = new Datas({
  init:(context)=>{
  	return
  	IF(context.user,()=>{
  		LOG("context.user",context.user.load({
	      memberships:{
	      	group:true
	      }
	    }))	
  	})
  },
  virtualization:[
   	new Controller(controls),
		new Load(),
	],
  models,
  constantes
})

datas
	.then((scope,next)=>{
		console.log(JSON.stringify(scope.scope,null," "))
		return next()
	})
  .then(new Memory({
    handlers:[
    	...Memory.handlers(),
      new Mongodb(config.mongo)],
  }))
module.exports = datas;