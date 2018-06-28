exports.avatar = function(message, args){
    message.reply(`here is the link ${message.author.displayAvatarURL}`);
    return;
}

exports.invite = function(message, args){
    message.reply(`the invite link is \`http://discord.gg/tespacarleton\``);
    return;
}

exports.role = function(message, args){
    if (args.length < 1 || args[0] == `--help`) {
        message.channel.send(`**These are game roles you're allowed to join:** \n${global.util.listToString(global.GAME_ROLES)} \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }

    let role = message.guild.roles.find(`name`, args.join(' '));
    if (GAME_ROLES.indexOf(args.join(' ')) === -1){
    message.channel.send(`Doesn't look like you're allowed to join ${args.join(' ')}.\nFor a full list of joinable roles use \`!role --help\` \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
    return;
    }
    message.member.addRole(role).catch(console.error);
    //Hack for Smash
    if(args[0] === `Smash4` || args[0] === `Melee`){
        message.member.addRole(`Smash`).catch(console.error);
    }

    message.channel.send(`You've been added to: ${args.join(' ') }!` );
    return
}

exports.rmrole = function(message, args){
    let role = message.guild.roles.find(`name`, args.join(' '));
    if (role){
    message.member.removeRole(role).catch(console.error);
    message.channel.send(`Yor are no longer a member of: ${args.join(' ') }... \nSorry to see you go` );
    return
    }
    message.channel.send(`I can't find the role${args.join(' ')}.\nAre you sure that is the name of the role you want to remove?\nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
    return
}

exports.help = function(message, args){
    message.channel.send(`Here are some things I can help you with: \n${global.util.listToString(Object.keys(exports))}`);
    return;
}

exports.who = function(message, args){
    message.reply(`ID: \`${message.author.id}\``);
    return;
}

exports.hello = function(message, args){
    message.reply(`${global.generator.message(`Greeting`)}`)
    return;
}