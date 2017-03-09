"use strict"
/*
TODO: INTEGRATE STEAM API
*/

/* default configuration. Only edit if you really know what yopu are doing */
const Settings = require(__dirname + "/settings.js")

/* npm INSTALLS */
const fs = require('fs'),
			ony = require("ony"),
			Discord = require('discord.js'),
			express = require('express'),
 			http = require('follow-redirects').http,
			https = require('follow-redirects').https,
			Promise = require('bluebird'),
			mp3Duration = require('mp3-duration'),
			sqlite3 = require('sqlite3').verbose()

/* install inits */
const	app = express(),
			bot = new Discord.Client()

let db

/* global variables */
let validChannels = Settings.validChannels
let validCommandArray = Settings.validCommandArray
let lastMessages = []
let startTime = Date.now()

/* Helpers */
const _embed = require(__dirname + "/assets/modules/messageEmbed.js")

/* CUSTOM NODES  */

/* Displays user avatar */
const A = require(__dirname + "/assets/modules/avatar.js")
/* Looks up phare on google */
const B = require(__dirname + "/assets/modules/bing.js")
/* Checks links, if they are "dirty", in other words not all redirects are followed */
const L = require(__dirname + "/assets/modules/linkcheck.js")
/* Shortens links with the ony module  */
const S = require(__dirname + "/assets/modules/shorten.js")
/* Steam integration */
const Steam = require(__dirname + "/assets/modules/steam.js")
/* Looks up phrase on urban dictionary  */
const U = require(__dirname + "/assets/modules/urban.js")
/* Looks up phrase on wikipedia  */
const W = require(__dirname + "/assets/modules/wiki.js")
/* Looks up images on imgur  */
const I = require(__dirname + "/assets/modules/imgur.js")

/* main logic */

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

const timeStampToHumanReadable = (diff) => {
	var timestamp = new Date(diff)
	var hours = ("0" + (timestamp.getHours()-1)).slice(-2)
	// Minutes part from the timestamp
	var minutes = ("0" + timestamp.getMinutes()).slice(-2);
	// Seconds part from the timestamp
	var seconds = ("0" + timestamp.getSeconds()).slice(-2);
	return "The bot has been online for {0} hours, {1} minutes and {2} seconds".format(hours,minutes,seconds);
}

const playFile = (randomFile) => {
	for (var _channel of bot.channels) {
		if (_channel[1].type == "voice" && _channel[1].name == Settings.bot.musicChannel) {
			let channel = bot.channels.get(_channel[1].id)
			channel.join().then((voiceConnection) => {
				voiceConnection.playFile(randomFile, () => {
					console.log("foo")
				})
			})
			break
		}
	}
}

let playInterval;

const runCommand = (cmd,message) => {
  let commands = cmd.split(" "),
      command = commands[0]

	let commandIsValid = validCommandArray.indexOf(command) != -1

  if (commandIsValid) {

    switch(command) {
			case "clear":
				if (!message.member.hasPermission('MANAGE_MESSAGES')) return
				let numMessages = parseInt(commands[1])
				if (!isNaN(numMessages) && numMessages > 0) {
					message.channel.bulkDelete(numMessages).then(() => {
						message.channel.sendMessage("",{embed: _embed.info("Info",numMessages + " messages deleted.")}).then((s) => {
							s.delete(5000);
						});
					})
				} else {
					// May be a @someone
					if (commands[1].startsWith("<")) {
						let userId = parseInt(commands[1].replace("<@","").replace(">",""))
						if (!isNaN(userId) && userId > 0) {

						}
					}
				}
			break;
			case "help":
				let _m = {
					title: "Help",
					thumbnail: bot.user.avatarURL,
					color: Settings.ui.colors.messages.info
				}
				_m.fields = [{
					title:"Available commands",
					value: "!" + validCommandArray.join(" **-** !")
				}]
				message.channel.sendMessage("", {
					embed : _embed.rich(_m)
				})
			break;
			case "play":
				clearInterval(playInterval)
				let subCmd = cmd.replace("play","").trim().length > 0 ? cmd.replace("play","").trim() : null
				if (subCmd != null) {
					if (subCmd == "help") {
						fs.readdir(__dirname + Settings.soundFx.folder, (err,files) => {
							if (err) {
								message.channel.sendMessage("", {
									embed: _embed.error("Error",err)
								})
								console.log(err)
								return
							}
							let playCmds = []
							files.forEach(file => {
								playCmds.push(file.split(".")[0])
							})
							message.channel.sendMessage("", {
								embed: _embed.info("Help","**Usage: **!play **" + playCmds.join("** | **") + "**")
							})
						})
						return
					}
					let filePath = __dirname + Settings.soundFx.folder + subCmd.trim() + ".mp3"
					fs.exists(filePath, (exists) => {
					  if (exists) {
					  	playFile(filePath)
					  } else {
							message.channel.sendMessage("", {
								embed: _embed.warning("Warning","**`!play " + subCmd + "`** is not a valid command. Type `!play help` for more.")
							})
						}
					})
				} else {
					fs.readdir(__dirname + Settings.soundFx.folder, (err, files) => {
						let randomFile = __dirname + Settings.soundFx.folder + files[Math.floor(Math.random() * ((files.length-1) - 0 + 1)) + 0]
						mp3Duration(randomFile, function (err, duration) {
						  if (err) return console.log(err.message);
							let dur = duration * 1000;
							playFile(randomFile)
							playInterval = setInterval(() => {
								playFile(randomFile)
							},dur)
						})
					})
				}
			break
			case "server":
			// Fix me!
			break
			case "steam":
				if (commands.length == 1) {
					Steam.get(true,message,"Not supported")
				} else {
					Steam.get(null,message,cmd.replace("steam",""))
				}
      break
			case "avatar":
				A.get(bot,message, cmd.replace("avatar","").trim(), (avatar) => {

					// message.channel.sendFile(avatar)
					message.delete()
				})
			break
			case "playing":
				bot.user.setGame(cmd.replace("playing ",""));
			break
			case "ping":
        message.channel.sendMessage("pong")
      break
			case "uptime":
				let thisTime = Date.now() - startTime
        message.channel.sendMessage(timeStampToHumanReadable(thisTime))
      break
      case "urban":
        U.get(bot,message,cmd.replace("urban ",""))
      break
      case "wiki":
        W.get(bot,message,cmd.replace("wiki ",""))
      break
			case "google":
        B.get(message,cmd.replace("google ",""))
      break
			case "imgur":
        I.get(message,cmd.replace("imgur ",""))
      break
      case "linkcheck":
        if (commands == 1) {
					L.checkLink(null,message, (err,r_link) => {
						if (err) {
							message.channel.sendMessage("Error!")
						} else {
							message.channel.sendMessage(r_link);
						}
					},bot)
        } else {
          if (commands.length != 2) {
            message.channel.sendMessage("Invalid input")
          } else {
            let link = commands[1].trim().toLowerCase();
            L.checkLink(link,message, (err,r_link) => {
              if (err) {
                message.channel.sendMessage("Error!")
              } else {
                message.channel.sendMessage(r_link);
              }
            })
          }
        }
      break
      case "shorten":
        if (commands.length != 2) {
          message.channel.sendMessage(message,"Syntax error")
          return
        }
        S.shorten(ony,commands[1], (err,url) => {
          if (!err) {
            message.channel.sendMessage(url)
          } else {
            message.channel.sendMessage("Shortening error")
          }
        })
      break
    }
  } else {
    message.channel.sendMessage("",{
			embed: _embed.error("Error","`!"+command + "` is not a valid command\nType `!help` for list of commands.")
		})
  }
}

/* bot logic */

const CheckTable = () => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER,author TEXT, type TEXT, content TEXT, channel TEXT, createdAt INTEGER)", err => {
		if (err != null) {
			console.log(err)
			return
		}
	});
}

bot.on("ready", () => {
	db = new sqlite3.Database('db.sqlite3', CheckTable);
	bot.user.setGame(Settings.bot.playing)
	bot.user.setUsername(Settings.bot.name)
	let avatarPath = __dirname + "\\assets\\img\\" + Settings.bot.avatar
	fs.exists(avatarPath, res => {
		if (!res) {
        console.log("Error setting bot avatar. Does " + Settings.bot.avatar + " live in " + __dirname + "\\assets\\img\\" + " ???")
				return
    }
		bot.user.setAvatar(avatarPath)
	})
})



const InsertIntoDatabase = row => {
	let stmt = db.prepare("INSERT INTO messages VALUES (?,?,?,?,?,?)")
	stmt.run(row.id,row.author,row.type,row.content,row.channel,row.createdAt)
	stmt.finalize()
}

function fetchMessages(cb) {
	db.all("SELECT * FROM messages ORDER BY id DESC", function(err, data) {
		cb(data)
		return
  })
}

const logMessage = message => {
	bot.fetchUser(message.author.id)
	.then(user => {
		let msg = {
			id: message.id,
			author: user.id + "|||" + user.username + "|||" + user.avatar,
			type: message.type,
			content: message.content,
			channel: message.channel.name,
			createdAt: message.createdTimestamp
		}
		InsertIntoDatabase(msg)
	})
}

bot.on('message', message => {
	logMessage(message)
	if (message.author.bot) return
	if (!message.content.startsWith(Settings.commandSymbol)) return
  let channelName = message.channel.name
  if (validChannels.indexOf(channelName) != -1) {
    runCommand(message.content.split(Settings.commandSymbol)[1],message)
  }
})

bot.login(Settings.bot.token)

/* app logic */

app.use('/public', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/views/home.html")
})

app.post('/messages', function(req, res) {
	fetchMessages((messages) => {
		messages.forEach(message => {
			let avatarData = message.author.split("|||") // [0] => userId [1] => userName [2] => [avatarId]
			message.userId = avatarData[0]
			message.username = avatarData[1]
			message.avatar = typeof avatarData[2] != "undefined" ? "https://cdn.discordapp.com/avatars/" + avatarData[0] + "/" + avatarData[2] + ".jpg" : null
		})
		res.setHeader('Content-Type', 'application/json')
		res.send(messages)
	})
})

app.listen(Settings.port, function () {
  console.log(Settings.bot.name + ' running on port '+ Settings.port)
})
