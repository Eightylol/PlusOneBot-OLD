"use strict"
/*
TODO: INTEGRATE STEAM API
*/

/* default configuration. Only edit if you really know what yopu are doing */
const Settings = require(__dirname + "/settings.js")

/* npm INSTALLS */
const ony = require("ony"),
			Discord = require('discord.js'),
			express = require('express'),
 			http = require('follow-redirects').http,
			https = require('follow-redirects').https

/* install inits */
const	app = express(),
			bot = new Discord.Client()

/* global variables */
let validChannels = Settings.validChannels
let validCommandArray = Settings.validCommandArray
let lastMessages = []
let startTime = Date.now()

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
/* RCon game server lookup */
const Rcon = require(__dirname + "/assets/modules/Rcon.js")
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

const DeleteMessages = (message,num,at) => {
	if (num > at) {
		let lastMessageID = message.channel.lastMessageID || null
		if (lastMessageID != null) {
			console.log(lastMessageID)
			DeleteMessages(message,num,at++)
		}
	}
}

const fs = require('fs'),
			path = require('path')


const runCommand = (cmd,message) => {
  let commands = cmd.split(" "),
      command = commands[0]

	let commandIsValid = validCommandArray.indexOf(command) != -1

  if (commandIsValid) {

    switch(command) {
			case "neger":
			var exec = require('child_process').exec;
				let files = [
					"neger1.png",
					"neger2.jpg",
					"neger3.jpg",
					"neger4.jpg",
					"neger5.jpg",
					"neger6.jpg",
					"neger7.jpg",
					"neger8.jpg"
				]
				let file = files[Math.floor(Math.random() * files.length)]
				let filePath = path.join(__dirname, '\\assets\\img\\' + file);
				console.log(filePath)
				let _cmd = [
				    'composite',
				    '-dissolve', '35%',
				    '-gravity', 'SouthEast',
				    '-quality', 100,
				    path.join(__dirname, '\\assets\\img\\plusone_logo.png'),
				    filePath,
				    path.join(__dirname, '\\assets\\img\\resultOfCompositeDoNotDelete.jpg')
				];
				// message.channel.sendFile(filePath)
				exec(_cmd.join(' '), function(err, stdout, stderr) {
					if(err != null) {
						console.log(stderr)
						message.channel.sendFile(filePath)
						return
					}
					message.channel.sendFile(__dirname + '\\assets\\img\\resultOfCompositeDoNotDelete.jpg')
				    // Do stuff with result here
				});
				message.delete()
				return
				fs.readFile(filePath, (err,data) => {
				})
			break
			case "server":
				Rcon.get(message,cmd.replace("server","").trim())
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
					// console.log(avatar)
					message.channel.sendFile(avatar)
					message.delete()
				})
			break
			case "playing":
				bot.user.setGame(cmd.replace("playing",""));
				message.delete()
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
						message.delete()
          } else {
            message.channel.sendMessage("Shortening error")
          }
        })
      break
    }
  } else {
    //message.channel.sendMessage(message,"This command does not exist")
  }
}

/* bot logic */

bot.on("ready", () => {
	bot.user.setGame(Settings.bot.playing);
})

bot.on('message', (message) => {

  let channelName = message.channel.name
  if (validChannels.indexOf(channelName) != -1) {
    let msg = message.toString()
    if (msg.startsWith(Settings.commandSymbol)) {
        let command = msg.split(Settings.commandSymbol)[1]
        runCommand(command,message)
    } else {
			lastMessages.push(msg)
		}
  }
})

bot.login('Mjg1ODQwNTUxMjA5NzMwMDQ4.C5Y_4g.WIAypaHYR1_pICF9I7keIUzamtI')

/* app logic */

app.use('/public', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/views/home.html")
})

app.listen(Settings.port, function () {
  console.log(Settings.bot.name + ' running on port '+ Settings.port)
})
