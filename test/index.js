
const models = require("./models")
const Datas = require("sools/modeling/Datas");
const Executor = require('sools/executing/Executor')
const Env = require('sools/virtualizing/Env')
const Mongodb = require('sools-mongodb/Source')

async function work() {
  let executor
  try {

    const datas = Datas.build({
      models,
    })

    executor = new Executor({
      handlers: [
        new Mongodb({
          datas,
          url: 'mongodb://localhost',
          db: 'sandbox'
        })]
    })

    await executor.start()
    const scope = Env.process(() => {
      console.log(OR)
      return OR(datas.users(), datas.users())
      return datas
        .users()
        .filter((user) => {
          return user.name.eq("cédric")
        })
        .get()
    })

    console.log(scope.toJSON())


    //const users = await executor.process(scope)
  }
  catch (e) {
    throw e
  }
  finally {
    if (executor)
      await executor.stop();
  }
}

work();
/**/