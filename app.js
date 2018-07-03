//General rule for globals: only admin commands can modify global values.

global.Discord = require(`discord.js`);
global.client = new Discord.Client();
client = global.client;
// The token of your bot - https://discordapp.com/developers/applications/me
global.token = process.env.DISCORD_TOKEN;

global.util = require('./util.js');

//Local
global.database = require(`./database.js`);
global.generator = require(`./generator.js`);
//Flag
global.devMode = false;
global.enableDB = true;
global.cleanMode = false;
global.welcomeMessage = false;

global.OWNER_LEVEL = 3;
global.ADMIN_LEVEL = 2;
global.MOD_LEVEL = 1;

//Admin IDs
global.userList = {};
global.specialChannels = {};
global.GAME_ROLES = [`Starcraft`, `Destiny`, `WoW`, `Rocket League`, `Hearthstone`, `Smash4`, `Melee`, `Smash`,`Overwatch`, `CS:GO`, `Smite`, `Fire Emblem`, `Paladins`, `Pokemon`, `Runescape`, `Tabletop`, `PUBG`, `Rainbow Six Siege`, `DotA`, `HOTS`, `League of Legends`, `Fortnite`, `PS4`, `XBOX`, `Switch`]
global.MEMBER_COMMANDS = require('./commands/member.js')
global.ADMIN_COMMANDS = require('./commands/admin.js');
global.MOD_COMMANDS = require('./commands/mod.js');
global.welcomeImage = "https://cdn.discordapp.com/attachments/443848163724623893/443857040683696139/RedditLink.png";

client.on(`ready`, () => {
  console.log(`I am ready!`);
  global.server = global.client.guilds.get(process.env.SERVER_ID);
  if(enableDB){
    global.util.updateUserPermissions();
    global.util.updateSpecialChannels();
    console.log("Connected to database succesfully");
    
	}
  if(devMode){
    console.log('devMode Enabled');
  }
  if(cleanMode){
    console.log('cleanMode Enabled');
  }
});

client.on(`message`, (message) => {
	//Full Log
  if(devMode){
    	//console.log(message)
	}else{
    //Shorthand Log
    if(message.channel != `DMChannel` && message.channel.guild){
      console.log(`Server: ` + message.channel.guild.name);
      //client.channels.get().send(message);
    }
    console.log(`Channel: ` + message.channel.name);
    console.log(`Message: ` + message.content);
    console.log(`Author: ` + message.author.username);
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
	//database.insert(`messages`, myobj);
	}
	// Set prefix
  let prefix = `!`
  // Exit if bot or prefix not found: Do all non-commands above this line
  if(!message.content.startsWith(prefix) || message.author.bot){
    return
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  try{
    if(devMode){
      console.log(`-----------------`);
      console.log('Command Detected');
      console.log(`Admin: ` + admin);
      console.log(`Moderator: ` + mod);
      console.log(`Args: ` + args);
      console.log(`Command: ` + command);
      console.log(`-----------------`);
    }
    //Deletes commands when sent
    if(cleanMode && message.channel != `DMChannel`){
      message.delete()
      .then(msg => console.log(`Deleted message from ${msg.author.username}`))
      .catch(console.error);
    }
  
    //Admin Only tools
    if (userList[message.author.id] > global.ADMIN_LEVEL){
      if (global.ADMIN_COMMANDS[command] != null){
        global.ADMIN_COMMANDS[command](message, args);
        return;
      }
    }
  
    //Moderator Only tools
    if (userList[message.author.id] > global.MOD_LEVEL){
      if (global.MOD_COMMANDS[command] != null){
        if(devMode){
          message.channel.send(`Moderator speaking - everyone better listen up!`);
        }
        global.MOD_COMMANDS[command](message, args);
        return;
      }
    }
    
    //Everybody tools
    if (global.MEMBER_COMMANDS[command] != null){
      global.MEMBER_COMMANDS[command](message, args);
      return;
    }
    message.channel.send(`${generator.message(`Command Not Found`,command)}`)
  }
  catch(err){
    if(devMode){
      message.channel.send(err.message);
    }
    else{
      message.channel.send(`An error occured processing the command "${command}"`);
    }
    
  }

});

client.on(`error`, e => { console.error(e) })

client.on(`guildMemberAdd`,member=>{
  if(welcomeMessage){
  member.send(" ", {files: [welcomeImage]}).catch(console.error);
  setTimeout(function(){
    member.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in <#${global.specialChannels['rules']}> and  then introduce yourself in <#${global.specialChannels['introductions']}> .\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
    }, 1000);
  }
});

client.login(global.token);
