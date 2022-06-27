const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'attendance'
});
 
connection.connect();

var db = function(){
	return {
		queryHandler: function(query){
			return new Promise(function(resolve, reject){
				connection.query(query, function(error, results, fields){
					if(error) reject(error);
					resolve(results);
				});
			})
		},
	}
};

var transaction = function () {
	return {
		begin: function(){
			connection.beginTransaction();
		},
		commit: function(){
			connection.commit();
		},
		rollback: function(){
			connection.rollback();
		}
	}
}

module.exports = {
	db: db(),
	transaction: transaction()
}