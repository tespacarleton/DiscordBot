//Make an announcement
exports.announcement = function(message, args){
  var channel = args.shift();
  if (global.channelList[channel]){
    message.channel.send(`**Channel ID: ** ${global.channelList[channel]}`);
    channel = global.channelList[channel];
  }
  if(client.channels.get(channel)){
    //Images
    var delay = 0;
    //Broken with cleanMode #BUG #TODO
    for (var [snowflake, attachment] of message.attachments) {
      delay++;
      client.channels.get(channel).send(" ", {files: [attachment.url]}).catch(console.error);
    }
    //Message
    if(args[0]){
      setTimeout(function(){
        client.channels.get(channel).send(args.join(" ")).catch(console.error);
      }, 1000*delay);
    }
  }else{
    message.channel.send(`The channel ID \`${channel}\` is not avalibale. Please check them channel ID`)
  }
  return;
}

//List mod commands
exports.mod = function(message, args){
  message.channel.send(`Here are some things I can help you with as an moderator: \n${global.modCommandList}`);
  return;
}