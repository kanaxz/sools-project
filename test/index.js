const Scope = require("sools/processing/Scope");
const Flow = require("sools/processing/Flow");
const models = require("./models");
const datas  = require("./datas");

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
    debugger
    var user = new models.user.type({
      id:'5e2f3e7b3909c23d74f71236'
    })
    var context = new datas.context.type({
      user
    })
    user.attach(datas);
    
    var users = await datas.execute(context,(datas, context,$) => {
      var firstGroup = datas.groups.atIndex(0)
    	return datas.users
        .filter((user,$)=>{
          return user.memberships.find((mb)=>{
            return mb.group.eq(firstGroup)
          })
        })
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


async function test(){
  var index= 0;
  async function check(){
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve((index++) < 3)
      },1000)
    })
  }

  while(await check()){
    console.log(index)
  }
}