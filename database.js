var mysql = require('mysql');
var db_config = {
	host : process.env.SQL_HOST,
	port : process.env.SQL_PORT,
  user : process.env.SQL_USER,
  password : process.env.SQL_PASS,
  database : process.env.SQL_DATABASE
}
var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.
  
	connection.connect(function(err) {              // The server is either down
	  if(err) {                                     // or restarting (takes a while sometimes).
		console.log('error when connecting to db:', err);
		setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
	  }                                     // to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
											// If you're also serving http, display a 503 error.
	connection.on('error', function(err) {
	  
	  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
		handleDisconnect();                         // lost due to either server restart, or a
	  } else {
		console.log('db error', err);               // connnection idle timeout (the wait_timeout
		throw err;                                  // server variable configures this)
	  }
	});
  }
  
handleDisconnect();

exports.getUsers = function() {
	return new Promise(function(resolve, reject) {
		connection.query(`SELECT id, permissions FROM bot_permissions`, function (error, results, fields) {
			if (error) return reject(error);
			var ids = new Map();
			for(var i=0; i < results.length; i++){
				ids[results[i].id] =  results[i].permissions;
			}
			return resolve(ids);
		});
	});
};

exports.promoteUser = function(user) {
	return new Promise(function(resolve, reject) {
		connection.query(
			`INSERT INTO bot_permissions VALUES (
				${user.id}, "${user.username}", "${user.discriminator}", 1, NULL
			)	ON DUPLICATE KEY UPDATE permissions=permissions+1`,
		function (error, results, fields) {
			if (error) return reject(error);
			return resolve(results);
		});
	});
}

exports.demoteUser = function(user) {
	return new Promise(function(resolve, reject) {
		connection.query(`UPDATE bot_permissions SET permissions=permissions-1 WHERE 
		id=${parseInt(user.id)};`,
		function (error, results, fields) {
			if (error) return reject(error);
			return resolve(results);
		});
	});
}

exports.setSpecialChannel = function(role, id, name) {
	return new Promise(function(resolve, reject) {
		console.log(id);
		connection.query(`INSERT INTO special_channels VALUES (
			"${role}", ${id}, "${name}"
		) ON DUPLICATE KEY UPDATE id= ${id}, name="${name}"`, function (error, results, fields) {
			if (error) return reject(error);
			return resolve(results);
		});
	});
}

exports.removeSpecialChannel = function(role) {
	return new Promise(function(resolve, reject) {
		connection.query(`DELETE FROM special_channels WHERE role="${role}"`,
		 function (error, results, fields) {
			if (error) return reject(error);
			return resolve(results);
		});
	});
}

exports.getSpecialChannels = function(){
	return new Promise(function(resolve, reject) {
		connection.query(`SELECT role, id FROM special_channels`, function (error, results, fields) {
			if (error) return reject(error);
			var roles = new Map();
			for(var i=0; i < results.length; i++){
				roles[results[i].role] =  results[i].id;
			}
			return resolve(roles);
		});
	});
}
exports.addLog = function(){};