module.exports = {
	bot : {
		name: "BOTNAME",
		playing:"FRESH",
		musicChannel: "Music",
	},
	steam: {
		apikey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // INSERT API KEY HERE
	},
	commandSymbol: "!",
	port:6543,
  validChannels : [
		"resources",
	  "general",
		"bot-testing"
	],
	validCommandArray : [
		"play",
		"ping",
	  "linkcheck",
	  "shorten",
	  "urban",
	  "wiki",
		"google",
		"server",
		"imgur",
		"steam",
		"uptime",
		"avatar",
		"playing"
	],
	soundFx : {
		folder: "\\assets\\soundFX\\"
	}

}
