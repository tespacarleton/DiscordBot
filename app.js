//General rule for globals: only admin commands can modify global values, but avoid it at all costs
//logger is the first thing declared so everyone can use it
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

global.logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({ level: 'info'}),
    new transports.File({ filename: 'error.log', level: 'error'}),
    new transports.File({ filename: 'info.log', level: 'info'}),
    new transports.File({ filename: 'debug.log'})
  ]
});

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
global.GAME_ROLES = [`Smash Ultimate`,`Rhythm`, `Speedrunning`,`Starcraft`, `Destiny`, `WoW`, `Rocket League`, `Hearthstone`, `Smash4`, `Melee`, `Smash`,`Overwatch`, `CS:GO`, `Smite`, `Fire Emblem`, `Paladins`, `Pokemon`, `Runescape`, `Tabletop`, `PUBG`, `Rainbow Six Siege`, `DotA`, `HOTS`, `League of Legends`, `Fortnite`, `PS4`, `XBOX`, `Switch`];
global.MEMBER_COMMANDS = require('./commands/member.js')
global.ADMIN_COMMANDS = require('./commands/admin.js');
global.MOD_COMMANDS = require('./commands/mod.js');
global.welcomeImage = "https://s26.postimg.cc/8x8hnunux/Reddit_Link.png";


logger = global.logger;
/*
 * Entry Condition: The DiscordJS bot is ready to start working
 * Action: Connect to the database, and get static information
 */
client.on(`ready`, () => {
  logger.info(`I am ready!`);
  global.server = global.client.guilds.get(process.env.SERVER_ID);
  if(enableDB){
    global.util.updateUserPermissions();
    global.util.updateSpecialChannels();
    logger.info("Synced to database successfully");
	}
  if(devMode){
    logger.info('devMode Enabled');
  }
  if(cleanMode){
    logger.info('cleanMode Enabled');
  }
});
/*
 * Entry Condition: The bot receives a message
 * Action: Handle the message
 * @param {DiscordJS Message} message - the relevant message object
 */
client.on(`message`, (message) => {
  //Full Log
  if(devMode){
    	logger.debug(message);
	}else{
    //Shorthand Log
    if(message.channel != `DMChannel` && message.channel.guild){
      logger.debug(`Server: ` + message.channel.guild.name);
      //client.channels.get().send(message);
    }
    logger.debug(`Channel: ` + message.channel.name);
    logger.debug(`Message: ` + message.content);
    logger.debug(`Author: ` + message.author.username);
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
    logger.debug(`-----------------`);
    logger.debug('Command Detected');
    logger.debug(`Admin: ` + (userList[message.author.id] > global.ADMIN_LEVEL));
    logger.debug(`Moderator: ` + (userList[message.author.id] > global.MOD_LEVEL));
    logger.debug(`Args: ` + args);
    logger.debug(`Command: ` + command);
    logger.debug(`-----------------`);
    //Deletes commands when sent
    if(cleanMode && message.channel != `DMChannel`){
      message.delete()
      .then(msg => logger.info(`Deleted message from ${msg.author.username}`))
      .catch(logger.error);
    }
  
    //Admin Only tools
    if (userList[message.author.id] >= global.ADMIN_LEVEL){
      if (global.ADMIN_COMMANDS[command] != null){
        global.ADMIN_COMMANDS[command](message, args);
        return;
      }
    }
  
    //Moderator Only tools
    if (userList[message.author.id] >= global.MOD_LEVEL){
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
  // For catching any uncaught errors
  catch(err){
    if(devMode){
      message.channel.send(err.stack);
    }
    else{
      err_msg = `AN ERROR OCCURED DURING "${command}" FROM ${message.author}
      ${err.stack}`
      logger.error(err_msg);
      util.logToServer(err_msg);
      message.channel.send(`An error occured processing the command "${command}"`);
    }
    
  }

});

/*
 * Entry Condition: DiscordJS recieves a "deleted message" signal
 * Action: Log the metadata about the message, and the message itself
 */
 client.on(`messageDelete`, message => {
  attachments = message.attachments.array().length!=0 ? "Yes" : "No";
  util.logToServer(`The following message was deleted:
    Id: ${message.id}
    Author: ${message.author}
    Content: "${message}"
    Attachments: ${attachments}`);
 });

/*
 * Entry Condition: DiscordJS recieves an "updated message" signal
 * Action: log the metadata and content of the old and new message
 */
client.on(`messageUpdate`, (oldMessage, newMessage) => {
  attachments = oldMessage.attachments.array().length!=0 ? "Yes" : "No";
  util.logToServer(`The following message was updated:
    Id: ${newMessage.id}
    Author: ${oldMessage.author}
    Attachments: ${attachments}
    Old Content: "${oldMessage}"
    New Content: "${newMessage}"`
   );
});
/*
 * Entry Condition: A user connects to a server
 * Action: Sends a welcome message
 */
client.on(`guildMemberAdd`,member=>{
  util.logToServer(`A new user has joined! :)
  User: ${member}
  Id: ${member.id}`);
  if(welcomeMessage){
  logger.info("Sending welcome message");
  member.send(" ", {files: [global.welcomeImage]}).catch(logger.error);
  setTimeout(function(){
    member.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in <#${global.specialChannels['rules']}> and  then introduce yourself in <#${global.specialChannels['introductions']}> .\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
    }, 1000);
  }
});

/*
 * Entry Condition: A user leaves the server
 * Action: Log the user leaving the server
 */
client.on(`guildMemberRemove`, member=> {
  util.logToServer(`A user has left... :(
  User: ${member}
  Id: ${member.id}`);
});

/*
 * Entry Condition: DiscordJS encounters a fatal error
 * Action: Logs the error, and attempts to reconnect
 */
client.on(`error`, e => { 
  logger.error("Fatal DiscordJS error");
  logger.error(e.stack);
  logger.error(e);
 });
client.login(global.token);
