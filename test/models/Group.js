const Model = require("sools/modeling/Model")
const String = require('sools/virtualizing/Virtual/enum/String')
const Error = require('sools/virtualizing/Virtual/enum/Error')

const check = (context, group, $) => {
  const admin = context.user.memberships.find((mb) => mb.group.eq({ name: 'admin' }))
  IF(admin.eq(null), () => {
    THROW(new Error(`Cannot access group ${group.name}}`))
  })
}

const Group = Model
  .extends({
    name: 'group',
    pluralName: 'groups',
  })
  .properties({
    _id: String,
    name: String,
  })
  .methods({
    toString: [String, function () {
      return this.name
    }]
  })
  .indexes({
    type: 'unique',
    properties: ['_id']
  }, {
    type: 'unique',
    properties: ['name']
  })
  .logic({
    add: (context, groups, next, $) => {
      return next(groups.forEach((group) => {
        check(context, group, $);
        group.owner = context.user
      }));
    },
    remove: (context, groups, next, $) => {
      return next(groups.forEach((group) => {
        check(context, group, $);
      }));
    },
  })

module.exports = Group

