var mysql = require('mysql');
var connection = mysql.createConnection({
	host : process.env.SQL_HOST,
	port : process.env.SQL_PORT,
  user : process.env.SQL_USER,
  password : process.env.SQL_PASS,
  database : process.env.SQL_DATABASE
});

exports.get_users = function(status) {
	return new Promise(function(resolve, reject) {
		connection.query(`SELECT id FROM user_privileges WHERE status='${status}'`, function (error, results, fields) {
			if (error) return reject(error);
			var ids = [];
			for(var i=0; i < results.length; i++){
				ids.push(results[i].id);
			}
			return resolve(ids);
		});
	});
};

exports.add_log = function()