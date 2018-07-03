# TespaCarleton DiscordBot
The code for the discord bot for use on the TespaCarleton Server.
Contact James Fitzgerald or Noah Steinberg to become a contributor or for general questions.

## Dev Setup
Requires Nodejs v8.9.1 or higher

To setup an environment, use your favourite text editor, and create a discord "App Bot User" at https://discordapp.com/developers/applications/me

Set environment variable "DISCORD_TOKEN" to the token found for your App Bot User. This is how the bot will authenticate/login as your App Bot User

Set environment variable "SERVER_ID" to the ID of the main server for the bot.

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

## SQL Database Requirements
In order to use the producting/other databases on HostGator you need to whitelist your IP, and contact the CTO for the credentials.
Otherwise ensure you have the following env variables:
    SQL_HOST : host to connect to (likely localhost for dev)
    SQL_PORT : port to connect to on the host
    SQL_USER : user to connect as
    SQL_PASS : password to authenticate with
    SQL_DATABASE : database to connect to 
    
### Tables
####bot_permissions
+---------------+-------------+------+-----+---------+-------+
| Field         | Type        | Null | Key | Default | Extra |
+---------------+-------------+------+-----+---------+-------+
| id            | varchar(50) | NO   | PRI |         |       |
| username      | varchar(32) | NO   |     | NULL    |       |
| discriminator | varchar(4)  | YES  |     | NULL    |       |
| permissions   | int(11)     | YES  |     | NULL    |       |
| notes         | text        | YES  |     | NULL    |       |
+---------------+-------------+------+-----+---------+-------+

####special_channels
+-------+--------------+------+-----+---------+-------+
| Field | Type         | Null | Key | Default | Extra |
+-------+--------------+------+-----+---------+-------+
| role  | varchar(255) | NO   | PRI | NULL    |       |
| id    | varchar(50)  | YES  |     | NULL    |       |
| name  | varchar(255) | YES  |     | NULL    |       |
+-------+--------------+------+-----+---------+-------+