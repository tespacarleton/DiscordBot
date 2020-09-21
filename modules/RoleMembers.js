const jsonexport = require('jsonexport');
const fs = require('fs');

exports.size = (msg, args) => {
    let roleID = args[0].split("<@&")[1];
    roleID = roleID.slice(0, -1);

    let role = msg.guild.roles.get(roleID);

    message.channel.send(`**${role.name}** has **${role.members.size}** members`);
}

exports.members = (msg, args) => {
    if (args.length != 0) {
        let roleID = args[0].split("<@&")[1];
        roleID = roleID.slice(0, -1);
    
        let role = msg.guild.roles.get(roleID);
    
        let rMembers = [];
        
        role.members.forEach(m => {
            let pushing = {
                "ID": `${m.id}`,
                "Username": m.displayName,
                "UserTag": m.user.tag
            }
            rMembers.push(pushing);
        });
    
        jsonexport(rMembers, function(err, csv){
            if (err) return console.error(err);
            fs.writeFile('./roleList.csv', csv, function (err) {
                if (err) throw err;
                msg.channel.send("Here is the list of members.", {
                    files: [
                        "./roleList.csv"
                    ]
                });
            });
        });
    }
    else {
        let rMembers = [];
        msg.guild.members.forEach(m => {
            let roles = "";

            m.roles.forEach(r => {
                roles = `${roles} ${r.name},`
            })

            roles = roles.slice(0, -1);
            roles.replace("@everyone, ", "");
            
            let pushing = {
                "ID": `${m.id}`,
                "Username": m.displayName,
                "UserTag": m.user.tag,
                "Roles": roles
            }
            rMembers.push(pushing);
        });

        jsonexport(rMembers, function(err, csv){
            if (err) return console.error(err);
            fs.writeFile('./roleList.csv', csv, function (err) {
                if (err) throw err;
                msg.channel.send("Here is the list of members.", {
                    files: [
                        "./roleList.csv"
                    ]
                });
            });
        });
    }
}