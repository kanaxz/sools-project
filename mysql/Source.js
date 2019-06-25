const Source = require("sools-data/Source");
const mysql = require("mysql");
class MysqlSource extends Source {
	constructor(options){
		super();
		this.pool = mysql.createPool(options);
	}

	query(query){
		
	}
}

module.exports = MysqlSource;