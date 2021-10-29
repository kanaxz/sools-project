const Group = require('./Group')
const User = require('./User')
const Membership = require('./Membership')
const HasMany = require('sools/modeling/virtualizing/Virtual/enum/HasMany')

Membership.properties({
  user: User,
  group: Group
})

User.properties({
  memberships: HasMany.of(Membership).extends({ on: 'user' }),
})

Group.properties({
  memberships: HasMany.of(Membership).extends({ on: 'group' }),
})

module.exports = {
  Group,
  User,
  Membership,
}