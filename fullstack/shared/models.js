const Virtual = require("sools/virtualizing/Virtual");
const Data = require("sools/data")
const Model = require("sools/data/Model");
const Object = require("sools/data/Object");
const constantes = require("./constantes")
module.exports = Data.define({
  position: {
    extends: Object,
    properties: {
      x: 'number',
      y: 'number'
    }
  },
  map: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string',
      clays: ['position']
    }
  },
  clan: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string'
    }
  },
  clanMap: {
    extends: Model,
    properties: {
      _id: 'string',
      clan: 'clan',
      map: 'map',
      name:'string',
      date:'date',
      position:'position',
      ressources: [{
        _id: 'string',
        gather:{
        	ressource:'number',
        	tool:'number'
        },
        currentLevel: {
          value: 'number',
          date:'datetime'
        },
        maxLevel: {
          value: 'number',
          plus: 'boolean'
        },
        type: 'string',
        position: 'position',
        quantity:'number'
      }]
    }
  },
  user: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string',
      email: 'string',
      password: 'string',
      memberships: ['membership']
    },
  },
  group: {
    extends: Model,
    properties: {
      _id: 'string',
      name: 'string',
      memberships: ['membership']
    },
  },
  membership: {
    extends: Model,
    properties: {
      _id: 'string',
      user: 'user',
      group: 'group'
    }
  }
})