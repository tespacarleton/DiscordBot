//database.js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://bot:bot@ds019078.mlab.com:19078/tespacarletondiscord";

exports.readyCheck = function (r) {
  return "DB Script ready"
};

exports.start = function(){
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	console.log("Database created!");
  	MongoClient.
  	db.close();
});
}

exports.insert = function(collection, data){
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	var dbo = db.db("tespacarletondiscord");
  	dbo.collection(collection).insertOne(data, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}