const Settings = require(__dirname + "\\..\\..\\settings.js"),
			SteamApi = require('steam-api'),
			app = new SteamApi.App(Settings.steam.apikey)

const gamedir = {
	conanexiles: "Conan Exiles",
	cstrike: "Counter-Strike: Source",
	Arma3: "Arma 3",
	"7DTD": "7 Days to Die",
	ark_survival_evolved: "ARK: Survival Evolved",
	csgo: "Counter-Strike: Global Offensive",
	rust: "Rust" 
}

const gServerFunc = (ipAndPort,cb) => {
	if (typeof ipAndPort == "undefined") return cb("empty")
	app.GetServersAtAddress(ipAndPort.split(":")[0]).done(function(serverList){
	  if (serverList && serverList.length > 0) {
			let gServers = []
			let i = 0
	  	serverList.forEach(server => {
				i++
				if (i > 25) return
				let gServer = {}
				if (server.hasOwnProperty("gamedir")) {
					gServer.title = gamedir[server.gamedir] || server.gamedir
					gServer.game = server.gamedir
				}
				if (server.hasOwnProperty("addr")) {
					let _split = server.addr.split(":")
					gServer.ip = _split[0]
					gServer.port = _split[1]
					gServer.connect = "steam://connect/" + gServer.ip + ":" + gServer.port
				}
				gServers.push(gServer)
			})
			cb(null,gServers)
	  }
	})
}
module.exports = {
  get : gServerFunc
}
