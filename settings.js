module.exports = {
	bot : {
		name: "PlusOneBot",
		playing:"PlusOne <3",
		musicChannel: "Music",
	},
	steam: {
		apikey: '729B074D90A891022A35C2C45D9CA03B' // INSERT API KEY HERE
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
