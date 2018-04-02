const Discord = require("discord.js");
const client = new Discord.Client();

const secret = "NDMwMjE2NzUzMTcyMTg1MDg5.DaNGGA.SJdesTJemakFSZATVIcyNvw8uK0";

//Local
var database = require("./database.js");

client.on("ready", () => {
  console.log("I am ready!");
  console.log(database.readyCheck());
});

client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  }
    console.log("Message: " + message.content);
    console.log("Server: " + message.channel.guild.name);
   	console.log("Channel: " + message.channel.name);
    console.log("Author: " + message.author.username);

    //console.log(message)
   	/*
   	var myobj = {

   		name: message.author.username, 
   		content: message.content
   	};*/
   	var myobj = {
	server:
	{
		serverID: message.channel.guild.id,
		serverName: message.channel.guild.name,
		serverRegion: message.channel.guild.region
	},
	channel:
	{
		channelID: message.channel.id,
		channelName: message.channel.name,
	},
	author: 
	{
		username: message.author.username,
		id: message.author.id,
		bot: message.author.bot
	},
	message: message.content,
	timestamp: message.createdTimestamp
};
    database.insert("messages", myobj);
});

client.login(secret);