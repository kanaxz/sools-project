const Model = require("sools/modeling/Model")
const String = require('sools/virtualizing/Virtual/enum/String')

const User = Model
  .extends({
    name: 'user',
    pluralName: 'users'
  })
  .properties({
    _id: String,
    name: String,
    password: String,
  })
  .indexes({
    type: 'unique',
    properties: ['_id']
  }, {
    type: 'unique',
    properties: ['name']
  })
  .methods({
    toString: [String, function () {
      return this.name
    }]
  })
  .logic({
    get(context, users, next) {
      return next(users.filter((user) => {
        DELETE(user.password)
        IF(user.eq(context.user), () => {
          return true
        })
        user.load({
          memberships: true
        })
        return user.memberships.find((mb) => {
          return context.user.memberships.find((cmb) => {
            return cmb.group.eq(mb.group);
          })
        })
      }))
    },
    add(contet, users) {
      const adminGroup = context.user.memberships.find((group) => group.name.eq("admin"))
      IF(adminGroup.eq(null), () => {
        THROW(new Error())
      })
    },
    update(context, users, next) {
      return next(users.filter((user) => {
        const isAdmin = context.user.memberships.find((mb) => mb.group.name.eq("admin"))
        return OR(isAdmin, user.eq(context.user))
      }), (user, save) => {
        IF(NOT(user.eq(context.user)), () => {
          DELETE(user.password)
        })
        user.password.onSet(({ newValue, next }) => {
          return next(Encrypter.encrypt(newValue))
        })
        save()
      })
    }
  })

module.exports = User