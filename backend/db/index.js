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

module.exports = {
	db: db()
}