const models = require("./models")
const Datas = require("sools/modeling/Datas");
const Executor = require('sools/executing/Executor')
const Env = require('sools/virtualizing/Env')
const Mongodb = require('sools-mongodb/Source')
const controls = require('./controls')
const Context = require('sools/modeling/Context')

async function work() {
  let executor
  try {

    const AppContext = Context
      .define({
        name: 'appContext',
      })
      .properties({
        user: models.User
      })

    const datas = Datas.build({
      context: Context,
      models,
    })

    Env.global.scope.process(() => {
      for (const modelName in controls) {
        datas[modelName].onGet(({ context, source, next }) => {
          return controls[modelName].get(context, source, next)
        })
      }
    })

    console.log(Env.global.scope.toJSON())
    /*
    executor = new Executor({
      handlers: [
        new Mongodb({
          datas,
          url: 'mongodb://192.168.1.10:27017/sandbox',
          db: 'sandbox'
        })]
    })

    await executor.start()
    /**/
  }
  catch (e) {
    throw e
  }
  finally {
    if (executor)
      await executor.stop();
  }
}

work()
