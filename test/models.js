const Virtual = require("sools/virtualizing/Virtual");
const utils = require("sools/modeling/utils")
const Model = require("sools/modeling/Model");
module.exports = utils.define({
  user: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string',
      password: 'string',
      memberships: ['membership']
    },
    indexes: [{
      type: 'unique',
      properties: ['_id']
    }, {
      type: 'unique',
      properties: ['name']
    }],
  },
  group: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string',
      memberships: ['membership']
    },
    indexes: [{
      type: 'unique',
      properties: ['_id']
    }, {
      type: 'unique',
      properties: ['name']
    }],
  },
  membership: {
    extends: Model,
    properties: {
      _id: 'string',
      user: 'user',
      group: 'group'
    },
    indexes: [{
      type: 'unique',
      properties: ['_id']
    },
    {
      type: 'unique',
      properties: ['user', 'group']
    }]
  }
})