# TespaCarleton DiscordBot Setup
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
Otherwise you will need to have an instance of mySQL to connect to, and ensure you have the following env variables:
    SQL_HOST : host to connect to (likely localhost for dev)
    SQL_PORT : port to connect to on the host
    SQL_USER : user to connect as
    SQL_PASS : password to authenticate with
    SQL_DATABASE : database to connect to 
    
### Tables
(if table formatting is poor, try viewing raw text)
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

# TespaCarleton Discordbot Developer Notes

## Discord API
Please see the discord.js API and guides located at https://discord.js.org/#/
## Recommended Setup (CTO current setup)

### Editor: Microsoft Visual Studio Code
Including addons: Bookmarks, Bracket Pair Colorizer, ESLint, Github build status,
Gitlens - Git supercharged.

### Node Version 8.9.1

### OS: Windows 10 with Ubuntu Subsystem enabled for Linux testing and mySQL.

## Style and Code Guide 

### File layout
app.js - base startup and bot logic
database.js - logic for working with persistent/stored data in the mysql database
generator.js - logic for providing peronalised error messages to end users
commands/*.js - logic for all different types of commands. Each file represents commands specific to a role/permission level.

### Function Documentation
Please document all functions as specified by http://usejsdoc.org/
Furthermore, feel free to include inline comments to clarify any program logic or longer functions

### Global Variable Usage
Several global variables are used to keep track of certain configuration values or constants throughout the program.
As a general rule, global variables should be avoided, but if you must make use of a global, please redefine it as a local
at the top of the file like
'''
logger = global.logger
'''
so it is easy to see what globals your module/file depends on.

### Other Style Notes
Overall, all commits/additions to the code are subject to code review from a developer with merge permissions from the main repo.
(Usually the CTO or a council member). Before asking for code review you should always keep in mind...
    Is my code clear?
    Is my code well commented?
    Is anything in my code hacky?
    Is there any errors I haven't accounted for?
    Have I tested this code on my own?
If any of these questions is not a resounding yes, you should reconsider asking for code review.