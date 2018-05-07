const Discord = require("discord.js");
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const secret = "NDMwMjE2NzUzMTcyMTg1MDg5.DaNGGA.SJdesTJemakFSZATVIcyNvw8uK0";

//Constants
const adminList = ["137041823683182592"];

//Local
var database = require("./database.js");
//Flag
var devMode = false;
var enableDB = false;
//Admin IDs
var moderatorList = [];
var GAME_ROLES = ["Starcraft", "Destiny", "WoW", "Rocket League", "Hearthstone", "Smash4", "Melee", "Smash","Overwatch", "CS:GO", "Smite", "Fire Emblem", "Paladins", "Pokemon", "Runescape", "Tabletop", "PUBG", "Rainbow Six Siege", "DotA", "HOTS", "League of Legends", "Fortnite"]


//Helpers
function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
function removeAll(array, element) {
	return array.filter(e => e !== element);
}

// Role List
let roleList = '';
GAME_ROLES.forEach((role) => {
  roleList = roleList.concat('- ' + role + '\n');
});

client.on("ready", () => {
  	console.log("I am ready!");
  	if(enableDB){
  		console.log(database.readyCheck());
	}
});

client.on("message", (message) => {
	//Full Log
    if(devMode){
    	console.log(message)
	}else{
	//Shorthand Log
	console.log("Message: " + message.content);
    console.log("Server: " + message.channel.guild.name);
   	console.log("Channel: " + message.channel.name);
    console.log("Author: " + message.author.username);
	}
   	/*
   	var myobj = {

   		name: message.author.username, 
   		content: message.content
   	};*/
   	//Database Stuff for nerds
   	if(enableDB){
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
	}

	// Set prefix
  	let prefix = "!"
	if (!message.content.startsWith(prefix) || message.author.bot) return;

		if (message.content.startsWith(prefix + 'role')) {
			let args = message.content.split(" ");
			if (args.length < 2 || args[1] == '--help') {
    		message.channel.sendMessage('These are game roles you\'re allowed to join: \n'+ roleList + '\nuse "!role `<role_name>` to join a role')
    		return
		}

		// Get the role
    	let role = message.guild.roles.find("name", args[1]);

    	//Hack for role with space in it (Not Working Currently)
    	if(role === "Fire"){
    		role = "Fire Emblem";
    	}
    	if(role === "Rocket"){
    		role = "Rocket League";
    	}
    	if(role === "Rainbow"){
    		role = "Rainbow Six Siege";
    	}
    	if(role === "League"){
    		role = "League of Legends";
    	}

    	if (!role || role === null) {
    		message.channel.sendMessage('Could not find a role by that name.')
     		return
    	}

   		if (roleList.indexOf(role.name) === -1) {
      		message.channel.sendMessage('Doesn\'t look like you\'re allowed to join that group. \nFor a list of allowed roles type `!role --help`')
     		return
   		}

    	message.member.addRole(role).catch(console.error);
    	//Hack for Smash
    	if(role === "Smash4" || role === "Melee"){
    		message.member.addRole("Smash").catch(console.error);
    	}
    	message.channel.sendMessage('You\'ve been added to: ' + role.name)
    	return
  	}
  	//Lists emotes on the server
	if (message.content.startsWith(prefix + "listemojis")) {
  		const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
  		message.channel.send(emojiList);
	}
});

client.on('error', e => { console.error(e) })

client.login(secret);