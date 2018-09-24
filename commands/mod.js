/*
 * Invocation Syntax: !announcement <id> <announcement>
 * Action: Makes announcement to the specified channel
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.announcement = function(message, args){
  var channelIdentifier = args.shift();
  var channel;
  //Check if we are given a channelName or a channelID
  logger.info(`Attempting to locate channel ${channelIdentifier}`);
  if(channelIdentifier.match(/^[0-9]+$/) != null){
    channel = global.util.getChannel({id: channelIdentifier, type: 'text'});
  }
  else if(channelIdentifier.match(/^<#[0-9]+>$/) != null){
    var id_rx = /^<#([0-9]+)>$/g;
    var id = id_rx.exec(channelIdentifier)[1];
    channel = global.util.getChannel({id: id, type: 'text'});
  }
  else{
    channel = undefined;
  }
  
  //Channel not found
  if(channel===undefined){
    message.channel.send(`The channel  \`${channelIdentifier}\' wasn't found... please check your spelling!`)
  }
  //Only one channel found
  else if(channel.length===undefined){
    logger.info(`Sending an announcement to ${channel} (${channel.name}) on behalf of ${message.author.id} (${message.author.username})`);
    //Images
    var delay = 0;
    //Broken with cleanMode #BUG #TODO
    for (var [snowflake, attachment] of message.attachments) {
      delay++;
      channel.send(" ", {files: [attachment.url]}).catch(logger.error);
    }
    //Message
    if(args[0]){
      setTimeout(function(){
        channel.send(args.join(" ")).catch(logger.error);
      }, 1000*delay);
    }
  }
  //Multiple channels found
  else{
    channelOptions = []
    channel.forEach(function(c) {
      channelOptions.push(JSON.stringify({id: c.id, server: c.guild.name}));
    });
    channelOptions = util.listToString(channelOptions);
    message.channel.send(`The channel \`${channelIdentifier}\` matches multiple channels!\n
      Please try again with a channelID: \n ${channelOptions}`)
  }
  return;
}

/*
 * Invocation Syntax: !mod
 * Action: List mod commands
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.mod = function(message, args){
  message.channel.send(`Here are some things I can help you with as an moderator: \n${global.util.listToString(Object.keys(exports))}`);
  return;
}