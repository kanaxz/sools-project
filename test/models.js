const Virtualizing = require("sools/virtualizing")
const Virtual = require("sools/virtualizing/Virtual");
const Data =  require("sools/data")
const Model = require("sools/data/Model");
module.exports = Data.define({
	user:{
		extends:Model,
		properties:{
			id:'string',
			name:'string',
			memberships:['membership']
		},
		indexes:[{
			type:'unique',
			properties:['id']
		},{
			type:'unique',
			properties:['name']
		}],
	},
	group:{
		extends:Model,
		properties:{
			id:'string',
			name:'string',
			memberships:['membership']
		},
		indexes:[{
			type:'unique',
			properties:['id']
		},{
			type:'unique',
			properties:['name']
		}],
	},
	membership:{
		extends:Model,
		properties:{
			id:'string',
			user:'user',
			group:'group'
		},
		indexes:[{
			type:'unique',
			properties:['id']
		},
		{
			type:'unique',
			properties:['user','group']
		}]
	}	
})