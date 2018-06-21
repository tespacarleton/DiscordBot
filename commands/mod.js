//Make an announcement
exports.announcement = function(message, args){
  var channelIdentifier = args.shift();
  //Check if we are given a channelName or a channelID
  if(channelIdentifier.match(/^[0-9]+$/) != null){
    channel = global.util.getChannel({id: channelIdentifier, type: 'text'});
  }
  else{
    channel = global.util.getChannel({channelName: channelIdentifier, type: 'text'});
  }

  //Channel not found
  if(channel===undefined){
    message.channel.send(`The channel  \`${channelIdentifier}\' wasn't found... please check your spelling!`)
  }
  //Only one channel found
  if(channel.length===undefined){
    //Images
    var delay = 0;
    //Broken with cleanMode #BUG #TODO
    for (var [snowflake, attachment] of message.attachments) {
      delay++;
      channel.send(" ", {files: [attachment.url]}).catch(console.error);
    }
    //Message
    if(args[0]){
      setTimeout(function(){
        channel.send(args.join(" ")).catch(console.error);
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

//List mod commands
exports.mod = function(message, args){
  message.channel.send(`Here are some things I can help you with as an moderator: \n${global.util.listToString(Object.keys(exports))}`);
  return;
}