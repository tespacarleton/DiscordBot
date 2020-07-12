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
    global.database.updateRoles();
    if (args.length < 1 || args[0] == `--help`) {
        message.channel.send(`**These are game roles you're allowed to join:** \n${global.util.listToString(global.GAME_ROLES)} \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }
    var input_role = args.join(' ');
    var role = undefined;
    for(var i = 0; i < GAME_ROLES.length; i++){
        if(GAME_ROLES[i].toLowerCase()===input_role.toLowerCase()){
            role = GAME_ROLES[i];
            break;
        }
    }
    if (role===undefined){
        message.channel.send(`Doesn't look like you're allowed to join ${args.join(' ')}, or it doesn't exist!\nFor a full list of joinable roles use \`!role --help\` \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }
    role = message.guild.roles.find(`name`, role);
    logger.info(`${message.author.username} attempting to join role ${role.name}`);
    message.member.addRole(role);
    //Hack for Smash
    if(args[0] === `Smash4` || args[0] === `Melee`){
        message.member.addRole(`Smash`);
    }

    message.channel.send(`You've been added to: ${role.name}` );
    return
}

/*
 * Invocation Syntax: !rmrole <role>
 * Action: Removes <role> from the user
 * @param {DiscordJS Message} message - discord js message
 * @param {string[]} args - args from command (pre split)
 */
exports.rmrole = function(message, args){
    var input_role = args.join(' ');
    var role = undefined;
    for(var i = 0; i < GAME_ROLES.length; i++){
        if(GAME_ROLES[i].toLowerCase()===input_role.toLowerCase()){
            role = GAME_ROLES[i];
            break;
        }
    }
    if (role===undefined){
        message.channel.send(`I can't find the role ${input_role}.\nAre you sure that is the name of the role you want to remove?\nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return
    }
    role = message.guild.roles.find(`name`, role);
    logger.info(`User ${message.author.username} leaving role ${role.name}`);
    if (role){
        message.member.removeRole(role).catch(logger.error);
        message.channel.send(`You are no longer a member of: ${role.name}... \nSorry to see you go` );
        return
    }
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

exports.steelseries = function(message, args){
    message.channel.send("<:tespa:589160644130111488> Tespa is partnered with <:SteelSeries:731930955320787045> SteelSeries\n\nCheck out https://carleton.gg/SteelSeries and use the code CU10 at checkout to support the club.")
    return;
}