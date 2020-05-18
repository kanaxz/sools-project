const Scope = require("sools/processing/Scope");
const Flow = require("sools/processing/Flow");
const models = require("../shared/models");
const datas = require("../server//datas");
const Function = require("sools/virtualizing/Virtual/enum/Function")
const Datas = require("sools/data/Datas");
const constantes = require("../shared/constantes")


global.DEBUG = true
class EntryPoint extends Flow {
  async setup() {
    var scope = new Scope();
    await super.setup(scope, () => {});
    scope.datas.context.registerProperties({
      user: models.user
    })
  }

  async stop() {
    await super.stop(new Scope(), () => {});
  }
}

var entryPoint = new EntryPoint()
entryPoint
  .then(datas)



async function work() {

  try {
  	var workingDatas = datas;
  	var setup = entryPoint;
  	/*

var testDatas = new Datas({
  init: (datas, context) => {

  },
  models,
  constantes
})
testDatas
  .then(async (scope, next) => {

  	var json = scope.scope.toJSON()
    scope.scope = datas.build(json)
    console.log(JSON.stringify(scope.scope, null, " "))
    
    return next();
  })
  .then(datas)

  	workingDatas = testDatas
  	setup = testDatas
  	/**/
    await setup.setup();
    var context = new datas.context.type({
      user: {
        _id: "5ebbc600e848a40a46a821b7"
      }
    })


    function feed(datas) {
      datas.users.get().delete()
      datas.memberships.get().delete()
      var users = datas.users.push({
        _id: "5ebbc600e848a40a46a821b7",
        name: 'Cédric'
      }, {
        name: 'Paul'
      })
      var groups = datas.groups.get();
      datas.memberships.push({
        user: users.atIndex(0),
        group: groups.atIndex(1)
      }, {
        user: users.atIndex(1),
        group: groups.atIndex(1)
      })
    }
    global.t1 = false
    var users = await workingDatas.execute(context, ({db,user}) => {
      //return feed(db);    	
      
      return db.ressources.push([{
      	level:55,
      	type:'wood',
      	position:{
      		x:500,
      		y:-1000
      	},
      	map:{
      		_id:"5ebfe824f1cb45042a678cff"
      	}
      }])
      //return datas.users.push({_id:'18',name:'test'},{name:'block pls'})
    })
    console.log(JSON.stringify(users, null, " "))
  } catch (e) {
    throw e;
  } finally {
    await entryPoint.stop(new Scope());
  }
}

work();
/**/