const Datas = require("sools/data/Datas");
const Mongodb = require("sools-mongodb/Source");
const Controller = require("sools/data/virtualizing/workers/Controller")
const AutoLoad = require("sools/data/virtualizing/workers/AutoLoad")
const Memory = require("sools/executing/Memory")
const controls = require("./controls")
const models = require("./models");
const ModelHandler = require("sools/data/executing/Model")
const HasManyHandler = require("sools/data/executing/HasMany")

var datas = new Datas({
  init:(datas,context)=>{
    context.user.memberships.load((mb)=>{
      mb.group.load()
    })
  },
  models,
  virtualization:[
    new AutoLoad(), 
    //new Controller(controls)
    /**/],
})
/*
datas
  .then(new Memory({
    handlers:[
      new Mongodb({
        url:'mongodb://localhost',
        db:'sandbox'
      }),
      new HasManyHandler(),
      new ModelHandler()],
  }))
/**/
module.exports = datas;