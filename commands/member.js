/*
 * Invocation Syntax: !avatar
 * Action: Gives a link to the users avatar
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.avatar = function(message, args){
    message.reply(`here is the link ${message.author.displayAvatarURL}`);
    return;
}
/*
 * Invocation Syntax: !invite
 * Action: Gives a link to the channel invite (TODO: hold this in a global)
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.invite = function(message, args){
    message.reply(`the invite link is \`http://discord.gg/tespacarleton\``);
    return;
}
/*
 * Invocation Syntax: !role <role>
 * Action: Adds <role> to the user
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.role = function(message, args){
    if (args.length < 1 || args[0] == `--help`) {
        message.channel.send(`**These are game roles you're allowed to join:** \n${global.util.listToString(global.GAME_ROLES)} \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }
    
    let role = message.guild.roles.find(`name`, args.join(' '));
    logger.info(`User ${message.author.username} attempting to join role ${role}`);
    if (GAME_ROLES.indexOf(args.join(' ')) === -1){
        message.channel.send(`Doesn't look like you're allowed to join ${args.join(' ')}.\nFor a full list of joinable roles use \`!role --help\` \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }
    message.author.addRole(role).catch(logger.error);
    //Hack for Smash
    if(args[0] === `Smash4` || args[0] === `Melee`){
        message.author.addRole(`Smash`).catch(logger.error);
    }

    message.channel.send(`You've been added to: ${args.join(' ') }!` );
    return
}

/*
 * Invocation Syntax: !rmrole <role>
 * Action: Removes <role> from the user
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.rmrole = function(message, args){
    let role = message.guild.roles.find(`name`, args.join(' '));
    logger.info(`User ${message.author.username} leaving role ${role}`);
    if (role){
        message.author.removeRole(role).catch(logger.error);
        message.channel.send(`Your are no longer a member of: ${args.join(' ') }... \nSorry to see you go` );
        return
    }
        message.channel.send(`I can't find the role ${args.join(' ')}.\nAre you sure that is the name of the role you want to remove?\nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return
}

/*
 * Invocation Syntax: !help
 * Action: Displays help message
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.help = function(message, args){
    message.channel.send(`Here are some things I can help you with: \n${global.util.listToString(Object.keys(exports))}`);
    return;
}

/*
 * Invocation Syntax: !who
 * Action: Returns the user ID
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.who = function(message, args){
    message.reply(`ID: \`${message.author.id}\``);
    return;
}
/*
 * Invocation Syntax: !hello
 * Action: Greets the user
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.hello = function(message, args){
    message.reply(`${global.generator.message(`Greeting`)}`)
    return;
}   