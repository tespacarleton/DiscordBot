/*
 * Invocation Syntax: !channel [list|set|remove] [role] [id]
 * Actions: 
 *  list: List all channels
 *  set: Set channel <role> for the specified <id>
 *  remove: Remove channel <role>
 *  none: Display current channel info
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.channel = function(message, args) {
    if (args[0] === 'list') {
        //TODO
        message.channel.send(`**The following channels shortcuts are available: **Currently Bugged #TODO**`);
    }
    else if (args[0] === 'set') {
        if(!args[1] || !args[2]){
            message.channel.send("Specify a role and a channel to assign it to!");
        }
        var id_rx = /^<#([0-9]+)>$/g;
        var id = id_rx.exec(args[2]);
        id = id ? id[1] : args[2];
        var channel = global.util.getChannel({id: id, type: 'text'});
        var role = args[1];
        logger.info(`Locating channel ${id}`);
        if(channel === undefined){
            message.channel.send("Could not find the channel!");
        }
        else{
            logger.info(`Assigning ${role} to channel ${channel.name}`);
            global.database.setSpecialChannel(role, channel.id, channel.name, message.channel);
            global.util.updateSpecialChannels(message.channel,`Successfully set channel ${channel} as the ${role} channel`);
        }
    }
    else if(args[0] === 'remove'){
        if(!args[1]){
            message.channel.send("Specify a role to remove!");
        }
        var role = args[1];
        logger.info(`Removing channel role ${role}`);
        global.database.removeSpecialChannel(role);
        global.util.updateSpecialChannels(message.channel, `Successfully removed the ${role} channel role`);
    }
    else {
        message.channel.send(`**Info for** ${message.channel}`);
        message.channel.send(`**ID:** ${message.channel.id}`);
    }
    return;
}

/*
 * Invocation Syntax: !emotelist
 * Action: Lists all emotes
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.emotelist = function(message, args) {
    const emojiList = message.guild.emojis.map(e => e.toString()).join(` `);
    message.channel.send(emojiList);
    return;
}  

/*
 * Invocation Syntax: !devmode
 * Action: Toggles devmode
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.devmode = function(message, args) {
    if (global.devMode) {
        logger.info(`devmode disabled`);
        message.channel.send(`Disabling DevMode. Who needs all those nerdy stats anyways.`);
        global.devMode = false;
    }
    else {
        logger.info(`devmode enabled`);
        message.channel.send(`Enabling DevMode. Do your best!`);
        global.devMode = true;
    }
    return;
}
/*
 * Invocation Syntax: !cleanmode
 * Action: Toggles cleanmode
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.cleanmode = function(message, args) {
    if (global.cleanMode) {
        logger.info(`cleanmode disabled`);
        message.channel.send(`Disabling CleanMode. Back to normal.`);
        global.cleanMode = false;
    }
    else {
        logger.info(`cleanmode enabled`);
        message.channel.send(`Enabling CleanMode. Working in secret I see.`);
        global.cleanMode = true;
    }
    return;
}

/*
 * Invocation Syntax: !status
 * Action: Displays configuration info
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.status = function(message, args) {
    if (!global.cleanMode) {
        message.channel.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    else {
        message.author.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    return;
}

/*
 * Invocation Syntax: !welcome_message
 * Action: Toggles welcome message
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.welcome_message = function(message, args) {
    if (global.welcomeMessage) {
        logger.info(`welcome message disabled`);
        message.channel.send(`Disabling Welcome Message!`);
        global.welcomeMessage = false;
    }
    else {
        logger.info(`welcome message enabled`);
        message.channel.send(`Enabling Welcome Message. Happy to help!`);
        global.welcomeMessage = true;
    }
    return;
}

/*
 * Invocation Syntax: !admin
 * Action: Displays admin commands
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.admin = function(message, args) {
    message.channel.send(`Here are some things I can help you with as an admin: \n${global.util.listToString(Object.keys(exports))}`);
    return;
}

/*
 * Invocation Syntax: !welcome
 * Action: Sends welcome message
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.welcome = function(message, args){
    message.channel.send(" ", {files: [global.welcomeImage]}).catch(logger.error);
    setTimeout(function(){
        message.channel.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in <#${global.specialChannels['rules']}> and  then introduce yourself in <#${global.specialChannels['introductions']}> .\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
        }, 1000);
    return;
}

/*
 * Invocation Syntax: !welcome_image <image>
 * Action: Sets welcome image to <image>
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.welcome_image = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguments for \`${command}\``);
        return;
    }
    global.welcomeImage = args[0];
    message.channel.send(`Changed Welcome image to ${global.welcomeImage}.`);
    return;
}

/*
 * Invocation Syntax: !promote <user>
 * Action: Promotes the user id specified
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.promote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguments for promote!`);
        return;
    }
    var id_rx = /^<@([0-9]+)>$/g;
    var id = id_rx.exec(args[0]);
    id = id ? id[1] : args[0];
    var user = global.util.getUser({id: id});
    logger.info(`Locating user ${id}`);
    if(user === undefined || global.userList[user.id]>=2){
        message.channel.send(`Cannot promote that user!`);
        return;
    }
    logger.info(`Promoting ${user.username}`);
    global.database.promoteUser(user).then(
        function(results){
            global.util.updateUserPermissions(message.channel, `Successfully promoted ${user}`);
        }).catch(
        function(reason){
            logger.error(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
}
/*
 * Invocation Syntax: !demote <user>
 * Action: Demotes the user id specified
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.demote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguments for demote!`);
        return;
    }
    var id_rx = /^<@([0-9]+)>$/g;
    var id = id_rx.exec(args[0]);
    id = id ? id[1] : args[0];
    var user = global.util.getUser({id: id});
    logger.info(`Locating user ${id}`);
    if(user === undefined || global.userList[user.id] === undefined || global.userList[user.id]>=3 || global.userList[user.id]<=0){
        message.channel.send(`Cannot demote that user!`);
        return;
    }
    logger.info(`Demoting ${user.username}`);
    global.database.demoteUser(user).then(
        function(results){
            global.util.updateUserPermissions(message.channel, `Successfully demoted ${user}`);
        }).catch(
        function(reason){
            logger.error(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
    return;
}