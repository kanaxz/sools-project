const Virtual = require("sools/virtualizing/Virtual");
const Data =  require("sools/data")
const Model = require("sools/data/Model");
module.exports = Data.define({
	user:{
		extends:Model,
		properties:{
			_id:'string',
			name:'string',
			memberships:['membership']
		},
		indexes:[{
			type:'unique',
			properties:['_id']
		},{
			type:'unique',
			properties:['name']
		}],
	},
	group:{
		extends:Model,
		properties:{
			_id:'string',
			name:'string',
			memberships:['membership']
		},
		indexes:[{
			type:'unique',
			properties:['_id']
		},{
			type:'unique',
			properties:['name']
		}],
	},
	membership:{
		extends:Model,
		properties:{
			_id:'string',
			user:'user',
			group:'group'
		},
		indexes:[{
			type:'unique',
			properties:['_id']
		},
		{
			type:'unique',
			properties:['user','group']
		}]
	}	
})