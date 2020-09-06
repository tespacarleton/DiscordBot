const nodemailer = require("nodemailer");

exports.verify = (msg, args) => {
    if (msg.channel.type == 'text') {
		msg.delete();
		msg.reply("Please use this command in DMs.");
		return;
	};

	let user = msg.author;
	let userID = msg.author.id;

	if (global.verifyCodes[userID] == args[0]) {
		user.send("Sucessfully verified.");
		delete global.verifyCodes[userID]
		global.client.guilds.get("638809854647074816").members.get(userID).addRole("669217045908553739");
	}
	else user.send("Invalid code. Please make sure the code is correct and not expired.");
}

exports.register = async (msg, args) => {
	if (msg.channel.type == 'text') {
		msg.delete();
		msg.reply("Please use this command in DMs.");
		return;
	};

	let user = msg.author;
	let userID = msg.author.id;

	let code = Math.floor(100000 + Math.random() * 900000);

	global.verifyCodes[userID] = code;

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
		Reply to the bot with the verify command (.verify ${code}).
		This code is only valid for the next 5 minutes.
		`
	});

	console.log(info)

	user.send(`Email sent to **${args[0]}**.`)
	
	setTimeout(()=>{
		delete global.verifyCodes[userID];
	}, 300000);
}