const Datas = require("sools/data/Datas");
const Mongodb = require("sools-mongodb/Source");
const Controller = require("sools/data/virtualizing/workers/Controller")
const AutoLoad = require("sools/data/virtualizing/workers/AutoLoad")
const Load = require('sools/data/virtualizing/workers/Load')

const Memory = require("sools/executing/Memory")
const controls = require("../shared/controls")
const models = require("../shared/models");
const Context = require("sools/data/virtualizing/Virtual/enum/Context")

Context.registerProperties({
  user:models.user
})  


var datas = new Datas({
	context:Context,
  init:(datas,context)=>{
    context.user.load({
      memberships:{
        group:true
      }
    })
  },
  models,
  virtualization:[
    
    new AutoLoad(), 
    new Load(),
    new Controller(controls)
    /**/],
})

datas
  
  .then(new Memory({
    handlers:[
      new Mongodb({
        url:'mongodb://localhost',
        db:'sandbox'
      })],
  }))
/**/
module.exports = datas;