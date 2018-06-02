# TespaCarleton DiscordBot
The code for the discord bot for use on the TespaCarleton Server.
Contact James Fitzgerald or Noah Steinberg to become a contributor or for general questions.

## Dev Setup
Requires Nodejs v8.9.1 or higher

To setup an environment, use your favourite text editor, and create a discord "App Bot User" at https://discordapp.com/developers/applications/me

Set environment variable "BOT_TOKEN" to the token found for your App Bot User. This is how the bot will authenticate/login as your App Bot User

Click the "Generate OAuth2 URL" and navigate to this URL in order to start your bot in a server you own (or check "Public Bot" and give the OAuth2 Url to someone else)

Start the app with 
'''
node app.js
'''

Ensure node dependencies are met with (run first line as admin)
'''
npm install --global --production windows-build-tools
npm install
'''
