const Model = require("sools/modeling/Model")
const String = require('sools/virtualizing/Virtual/enum/String')
const Error = require('sools/virtualizing/Virtual/enum/Error')

const check = ({ user }, memberships, next) => {
  return next(memberships.forEach((mb) => {
    IF(NOT(mb.group.owner.eq(user)), () => {
      THROW(new Error())
    })
  }))
}

const Membership = Model
  .extends({
    name: 'membership',
    pluralName: 'memberships'
  })
  .properties({
    _id: String,
  })
  .logic({
    add: check,
    update() {
      throw new Error("Cannot update memberships")
    },
    remove: check,
    get(context, memberships, next) {
      return next(memberships.filter((membership) => {
        IF(membership.user.eq(context.user), () => {
          return true;
        })
        membership.load({
          group: {
            memberships: true
          }
        })
        return membership.group.memberships.find(
          (mb) => mb.user.eq(context.user)
        )
      }))
    }
  })

module.exports = Membership