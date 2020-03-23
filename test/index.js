const Scope = require("sools/processing/Scope");
const Flow = require("sools/processing/Flow");
const models = require("./models");
const datas  = require("./datas");
const Function = require("sools/virtualizing/Virtual/enum/Function")

global.DEBUG = true
class EntryPoint extends Flow {
  async setup(scope){
    await super.setup(scope, ()=>{});
    scope.context.registerProperties({
      user:models.user
    })    
  }
}

var entryPoint = new EntryPoint()
entryPoint
  .then(datas)

async function work() {

	try{ 
		await entryPoint.setup(new Scope());
    var context = new datas.context.type({
      user:{
       id:'5e2f3e7b3909c23d74f71236',
      }
    })
    
    
    var users = await datas.execute(context,(datas, context,$) => {
    	return datas.users
        //.filter((user)=>user.name.eq("Paul"))

        .map((user)=>({
          user,
          memberships:user.memberships
        }))
        /**/
      return {
        firstGroup,
        users,
      }
        /*
        .map((user)=>({
          user,
          memberships:user.memberships
        }))
        .filter((infos)=>{
          return infos.memberships.find((mb)=>{
            return mb.group.eq({
              id:'6e4fe1f2fb250034c4e4ad77'
            })
          })
        })
    	var test = datas.users.filter((user)=>user)
      return {
      	users
      }
      /**/
    })
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