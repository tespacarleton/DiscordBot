//General rule for globals: only admin commands can modify global values.

global.Discord = require(`discord.js`);
global.client = new Discord.Client();
// The token of your bot - https://discordapp.com/developers/applications/me
global.token = process.env.DISCORD_TOKEN;

//Constants

//Local
global.database = require(`./database.js`);
global.generator = require(`./generator.js`);
//Flag
global.devMode = false;
global.enableDB = true;
global.cleanMode = false;
global.welcomeMessage = false;

//Admin IDs
global.adminList = [];
global.modList = [];
global.userList = [];
global.GAME_ROLES = [`Starcraft`, `Destiny`, `WoW`, `Rocket League`, `Hearthstone`, `Smash4`, `Melee`, `Smash`,`Overwatch`, `CS:GO`, `Smite`, `Fire Emblem`, `Paladins`, `Pokemon`, `Runescape`, `Tabletop`, `PUBG`, `Rainbow Six Siege`, `DotA`, `HOTS`, `League of Legends`, `Fortnite`, `PS4`, `XBOX`, `Switch`]
global.MEMBER_COMMANDS = require('./commands/member.js')
global.ADMIN_COMMANDS = require('./commands/admin.js');
global.MOD_COMMANDS = require('./commands/mod.js');
global.channelList = {};
global.introductions = '#introductions';
global.rules = "#welcome";
global.welcomeImage = "https://cdn.discordapp.com/attachments/443848163724623893/443857040683696139/RedditLink.png";

//Helpers
global.remove = function(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

global.removeAll = function(array, element) {
	return array.filter(e => e !== element);
  //test
}
global.contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === `function`) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

global.roleList = ``;


function fillLists(){
  // Role List
  GAME_ROLES.forEach((role) => {
    roleList = roleList.concat(`- ${role}\n`);
  });
};

client.on(`ready`, () => {
  console.log(`I am ready!`);
  if(enableDB){
    Promise.all([database.get_users('admin'), database.get_users('mod'), database.get_users('user')])
    .then(function(allData) {
      adminList = allData[0];
      moderatorList = allData[1];
      memberList = allData[2];
      console.log("database connection successful")
    });
    
	}
  if(devMode){
    console.log('devMode Enabled');
  }
  if(cleanMode){
    console.log('cleanMode Enabled');
  }
  fillLists();
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
  var admin = contains.call(adminList, message.author.id);
  var mod = contains.call(moderatorList, message.author.id);
	// Set prefix
  let prefix = `!`
  // Exit if bot or prefix not found: Do all non-commands above this line
  if(!message.content.startsWith(prefix) || message.author.bot){
    return
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
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
  if (admin){
    if (global.ADMIN_COMMANDS[command] != null){
      global.ADMIN_COMMANDS[command](message, args);
      return;
    }
  }

  //Moderator Only tools
  if (mod){
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

});

client.on(`error`, e => { console.error(e) })

client.on(`guildMemberAdd`,member=>{
  if(welcomeMessage){
  member.send(" ", {files: [welcomeImage]}).catch(console.error);
  setTimeout(function(){
    member.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in ${rules} and  then introduce yourself in ${introductions}.\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
    }, 1000);
  }
});

client.login(token);
