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
       _id:'5e2f3e7b3909c23d74f71236',
      }
    })
    
    
    var users = await datas.execute(context,(datas, context,$) => {
    	return datas.users.get()
    		.filter((user)=>user.name.eq("Cédric"))
    		.update((user,save)=>{
    			user.name = 'test'
    			save()
    		})
      /**/
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