//generator.js

/*
List of context:
Command not found
Greeting
*/
exports.message = function(context, value){
	var response = ``;
	var variations = -1;
	context = context.toLowerCase();
	if(context === `command not found`){
		variations = 4;
		var x = Math.floor(Math.random() * variations);
		switch(x){
			case 0:
				response = `English Please! I have no idea what the command \`${value}\` is for. Do you want a list of things I'm good at? Just ask for \`!help\``
				break;
			case 1:
				response = `What do you mean by \`${value}\`?`
				break;
			case 2:
				response = `I've never ever heard of \`${value}\`...`
				break;
			case 3:
				response = `This again... \nWhat do you expect me to do when you ask for \`${value}\``
				break;
			default:
			//Out of bounds on response
			response = `Oh shoot I don't feel to good. Someone call an admin!`
		}
		return response;
	}
	if(context === `greeting`){
		variations = 3;
		var x = Math.floor(Math.random() * variations);
		switch(x){
			case 0:
				response = `oh hello there. I'm Tessa and I help out here in the Tespa Carleton Discord. \nLet me know if you need anything!`
			break;
			case 1:
				response = `whats new? \nLet me know if you need anything!`
			break;
			case 2:
				response = `have no fear, Tessa is here! \nLet me know if you need anything!`
			break;
			default:
			//Out of bounds on response
			response = `Oh shoot I don't feel to good. Someone call an admin!`
		}
		return response;
	}
	response = `I don't even know how to reply to that...`;
	return response;
}