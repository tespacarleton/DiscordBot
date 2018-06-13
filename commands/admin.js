exports.channel = function(message, args) {
    //Updates Channel info on bot
    if (args[0] === 'update') {
        global.channelList[message.channel.name] = message.channel.id;
        if (global.cleanMode) {
            message.author.send(`**Updated** ${message.channel} -> ${global.channelList[message.channel.name]}`);
        }
        else {
            message.channel.send(`**Updated** ${message.channel} -> ${global.channelList[message.channel.name]}`);
        }
        //Lists channels with shortcuts
    }
    else if (args[0] === 'list') {
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
    message.channel.send(`Here are some things I can help you with as an admin: \n${global.adminCommandList}`);
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
        message.channel.send(`You need arguements for \`${command}\``);
        return;
    }
    global.moderatorList.push(args[0]);
    message.channel.send(`Mod List Updated!`);
    return;
}

exports.demote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguements for \`${command}\``);
        return;
    }
    global.remove(global.moderatorList, args[0]);
    message.channel.send(`Mod List Updated!`);
    return;
}