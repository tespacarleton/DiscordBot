client = global.client;
server = global.server;
logger = global.logger;

exports.remove = function(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
};

exports.removeAll = function(array, element) {
	return array.filter(e => e !== element);
  //test
};

exports.contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === `function`) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            console.log(needle);
            for(i = 0; i < this.length; i++) {
                var item = this[i];
                console.log(item);
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

exports.listToString = function(list){
    result = '';
    list.forEach((role) => {
        result = result.concat(`- ${role}\n`);
      });
    return result;  
};

exports.getUser = function(options={id: undefined, displayName: undefined}){
    id = options.id;
    displayName = options.displayName;
    if(id!==undefined){
        console.log(id);
        var user =  global.server.members.get(id);
        if(user){
            return user.user
        }
    }
    else if(displayName!==undefined){
        //Filter for proper display names
        matches = global.server.members.filter(function(member) {
            return member.user.username===displayName;
        });

        //Get the useful user object with the data we need
        users = []
        matches.forEach(function(member, index, arr) {
            users.push(member.user);
        });
        // If matches is a list of length 1, just return the element
        if (users.length===1){
            return users[0];
        }
        // otherwise return the whole list
        if (users.length > 1){
            return users;
        }
        return undefined;
    }
    return undefined;
};

exports.getChannel = function(options={id: undefined, channelName: undefined, type: 'text'}){
    id = options.id;
    channelName = options.channelName;
    type = options.type;
    if(id!==undefined){
        return global.server.channels.get(id);
    }
    else if(channelName!==undefined){
        //Filter for proper display names
        matches = global.server.channels.filter(function(channel) {
            return channel.type===type && channel.name===channelName;
        });
        //Turn the map into a list
        channels = []
        matches.forEach(function(channel, index, arr) {
            channels.push(channel);
        });
        // If matches is a list of length 1, just return the element
        if (channels.length===1){
            return channels[0];
        }
        // otherwise return the whole list
        if (channels.length > 1){
            return channels;
        }
        // or there isnt anything found
        return undefined;
    }
    else{
        return "You must specify either an id or a channelName!";
    }
};

exports.getUsers = function(){
    //Get the useful user object with the data we need, in a list
    members = server.members;
    users = [];
    members.forEach(function(member, index, arr) {
        users.push(member.user);
    });
    return users;
};

exports.getChannels = function(){
    //Get the channels into a list
    members = global.server.channels;
    channels = [];
    members.forEach(function(channel, index, arr) {
        channels.push(channel.user);
    });
    return channels;
};

exports.updateUserPermissions = function(callbackChannel=undefined, msg=undefined){
    Promise.resolve(global.database.getUsers())
    .then(function(results) {
      global.userList = results;
      if(callbackChannel !== undefined && msg !== undefined){
          callbackChannel.send(msg);
      }
    })
    .catch(function(e) {
        console.log("handled error");
    });;
}

exports.updateSpecialChannels = function(callbackChannel=undefined, msg=undefined){
    Promise.resolve(global.database.getSpecialChannels())
    .then(function(results) {
      global.specialChannels = results;
      if(callbackChannel !== undefined && msg !== undefined){
          callbackChannel.send(msg);
      }
    })
    .catch(function(e) {
        console.log("handled error");
    });
}

exports.logToServer = function(msg, level=undefined){
    if('log' in global.specialChannels){
        global.server.channels.get(global.specialChannels['log']).send(msg);
    }
    else{
        logger.warn("Please set a server 'log' channel in order to maximize usage of bot features");
    }
}