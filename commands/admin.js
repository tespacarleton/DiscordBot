exports.channel = function(message, args) {
    if (args[0] === 'list') {
        //TODO
        message.channel.send(`**The following channels shortcuts are avalibale: **Currently Bugged #TODO**`);
    }
    else if (args[0] === 'rules') {
        rules = message.channel;
        message.author.send(`**Updated** ${message.channel} -> Rules Channel}`);
        message.delete();
    }
    else if (args[0] === 'introductions') {
        introductions = message.channel;
        message.author.send(`**Updated** ${message.channel} -> Introductions Channel}`);
        message.delete();
    }
    else {
        message.channel.send(`**Info for** ${message.channel}`);
        message.channel.send(`**ID:** ${message.channel.id}`);
    }
    return;
}

exports.emotelist = function(message, args) {
    const emojiList = message.guild.emojis.map(e => e.toString()).join(` `);
    message.channel.send(emojiList);
    return;
}  

exports.devmode = function(message, args) {
    if (global.devMode) {
        message.channel.send(`Disabling DevMode. Who needs all those nerdy stats anyways.`);
        global.devMode = false;
    }
    else {
        message.channel.send(`Enabling DevMode. Do your best!`);
        global.devMode = true;
    }
    return;
}

exports.cleanmode = function(message, args) {
    if (global.cleanMode) {
        message.channel.send(`Disabling CleanMode. Back to normal.`);
        global.cleanMode = false;
    }
    else {
        message.channel.send(`Enabling CleanMode. Working in secret I see.`);
        global.cleanMode = true;
    }
    return;
}

exports.status = function(message, args) {
    if (!global.cleanMode) {
        message.channel.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    else {
        message.author.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    return;
}

exports.welcomeMessage = function(message, args) {
    if (global.welcomeMessage) {
        message.channel.send(`Disabling Welcome Message!`);
        global.welcomeMessage = false;
    }
    else {
        message.channel.send(`Enabling Welcome Message. Happy to help!`);
        global.welcomeMessage = true;
    }
    return;
}

exports.admin = function(message, args) {
    message.channel.send(`Here are some things I can help you with as an admin: \n${global.util.listToString(Object.keys(exports))}`);
    return;
}

exports.welcomeImage = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguements for \`${command}\``);
        return;
    }
    global.welcomeImage = args[0];
    message.channel.send(`Changed Welcome image to ${global.welcomeImage}.`);
    return;
}

exports.promote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguements for promote!`);
        return;
    }
    if(args[0].match(/^[0-9]+$/) != null){
        var user = global.util.getUser({id: args[0]});
      }
      else{
        var user = global.util.getUser({displayName: args[0]});
    }
    if(user.length !== undefined){
        userOptions = []
        user.forEach(function(u) {
            userOptions.push(
                JSON.stringify({id: u.id, username: u.username, discriminator: u.discriminator})
            );
        });
        userOptions = util.listToString(userOptions);
        message.channel.send(`The identifier \`${args[0]}\` matches multiple users!\n
            Please try again with a userID: \n ${userOptions}`)
        return;
    }
    if(global.userList[parseInt(user.id)]>=2){
        message.channel.send(`Cannot promote an admin!`)
        return;
    }
    global.database.promoteUser(user).then(
        function(results){
            global.database.getUsers();
            message.channel.send(`Mod List Updated!`);
        }).catch(
        function(reason){
            console.log(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
}

//TODO ensure database update works
exports.demote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguements for demote!`);
        return;
    }
    if(args[0].match(/^[0-9]+$/) != null){
        var user = global.util.getUser({id: args[0]});
    }
    else{
        var user = global.util.getUser({displayName: args[0]});
    }
    if(user.length !== undefined){
        userOptions = []
        user.forEach(function(u) {
            userOptions.push(
                JSON.stringify({id: u.id, username: u.username, discriminator: u.discriminator})
            );
        });
        userOptions = util.listToString(userOptions);
        message.channel.send(`The identifier \`${args[0]}\` matches multiple users!\n
            Please try again with a userID: \n ${userOptions}`)
        return;
    }
    if(global.userList[parseInt(user.id)]>=3){
        message.channel.send(`Cannot demote an owner!`)
        return;
    }
    else if(global.userList[parseInt(user.id)]<=0){
        message.channel.send(`Cannot demote a user!`)
        return;
    }
    global.database.demoteUser(user).then(
        function(results){
            global.database.getUsers();
            message.channel.send(`Mod List Updated!`);
        }).catch(
        function(reason){
            console.log(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
    return;
}