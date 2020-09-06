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
		msg.guild.members.get(userID).addRole("725421359446097950");
	}
	else user.send("Invalid code. Please make sure the code is correct and not expired.");
}

exports.register = (msg, args) => {
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
		host: "mail.carleton.gg",
		port: 25,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "devtest@carleton.gg",
			pass: "devtest"
		},
	});

	const info = await transporter.sendMail({
		from: '"TESPA Verify" <devtest@carleton.gg>',
		to: args[0],
		subject: "Verification Code",
		text: `
		Your verification code is "${code}".
		Reply to the bot with the verify command (.verify ${code}).
		This code is only valid for the next 5 minutes.
		`
	});

	user.send(`Email sent to **${args[0]}**.`)
	
	setTimeout(()=>{
		delete global.verifyCodes[userID]
	}, 300000);
}