const Scope = require("sools/processing/Scope");
const Flow = require("sools/processing/Flow");
const models = require("./models");
const datas  = require("./datas");
const Function = require("sools/virtualizing/Virtual/enum/Function")
const Datas = require("sools/data/Datas");
var testDatas = new Datas({
  init:(datas,context)=>{
    
  },
  models,
  virtualization:[
    /**/],
})

global.DEBUG = true
class EntryPoint extends Flow {
  async setup(scope){
    await super.setup(scope, ()=>{});
    scope.datas.context.registerProperties({
      user:models.user
    })    
  }
}

var entryPoint = new EntryPoint()
entryPoint
  .then(datas)

 testDatas
  .then(async (scope, next)=>{

    
    scope.scope = datas.build(scope.scope.toJSON())
    console.log(JSON.stringify(scope.scope,null," "))
    /**/
    return next();
  })
  .then(datas)



async function work() {

	try{ 
		await entryPoint.setup(new Scope());
    //await testDatas.setup(new Scope());
    var context = new datas.context.type({
      user:{
       _id:'5ebbc600e848a40a46a821b7',
      }
    })
    
    function feed(datas){
    	datas.users.get().delete()
    	datas.memberships.get().delete()
    	var users = datas.users.push({
    		_id:"5ebbc600e848a40a46a821b7",
    		name:'Cédric'
    	},{
    		name:'Paul'
    	})
    	var groups = datas.groups.get();
    	datas.memberships.push({
    		user:users.atIndex(0),
    		group:groups.atIndex(0)
    	},{
    		user:users.atIndex(1),
    		group:groups.atIndex(1)
    	})
    }
    
    var users = await datas.execute(context,(datas, context,$) => {
    	//feed(datas);    		
    	return datas.users.get()
    })
    console.log(JSON.stringify(users,null," "))
	}
  catch(e){
  	throw e;
  }
  finally {
  	await entryPoint.stop();
  }
}

work();
/**/