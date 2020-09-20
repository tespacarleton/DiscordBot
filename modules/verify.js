const nodemailer = require("nodemailer");

exports.verify = async (msg, args) => {
    if (msg.channel.type == 'text') {
		msg.delete();
		msg.reply("Please use this command in DMs.");
		return;
	};

	let user = msg.author;
	let userID = msg.author.id;

	if (global.verifyCodes[userID]) {
		if (global.verifyCodes[userID].code == args[0]) {
			try {
				await global.database.addVerifiedStudent(userID, msg.author.username, global.verifyCodes[userID].email);
				global.client.guilds.get("225297950568349706").members.get(userID).addRole(process.env.VERIFIED_ROLE);
				user.send("Sucessfully verified.");
			}
			catch (e) {
				user.send(`An error has occured. Please contact <@&${process.env.DEV_ROLE}>.`);
			}
			delete global.verifyCodes[userID];
		}
		else user.send("Invalid code. Please make sure the code is correct and not expired.");
	}
	else user.send("Please type !register [email] first.");
}

exports.register = async (msg, args) => {
	if (msg.channel.type == 'text') {
		msg.delete();
		msg.reply("Please use this command in DMs.");
		return;
	};

	let user = msg.author;
	let userID = msg.author.id;

	if (args[0].endsWith("@cmail.carleton.ca")) {	
		let code = Math.floor(100000 + Math.random() * 900000);
	
		global.verifyCodes[userID] = {
			"code": code,
			"email": args[0]
		};
	
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		})
	
		const info = await transporter.sendMail({
			from: '"TESPA Verify" <verify@carleton.gg>',
			to: args[0],
			subject: "Verification Code",
			text: `
			Your verification code is "${code}".
			Reply to the bot with the verify command (!verify ${code}).
			This code is only valid for the next 5 minutes.
			`
		});
	
		user.send(`Email sent to **${args[0]}**.`)
		
		setTimeout(()=>{
			try { delete global.verifyCodes[userID]; }
			catch (e) {}
		}, 300000);
	}
	else user.send(`Please provide a valid cmail address (*email@cmail.carleton.ca*)`);
}