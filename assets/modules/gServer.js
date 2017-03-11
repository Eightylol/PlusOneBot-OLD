const Settings = require(__dirname + "\\..\\..\\settings.js"),
			SteamApi = require('steam-api'),
			app = new SteamApi.App(Settings.steam.apikey),
			SourceCon = require("sourcecon")

const gamedir = {
	conanexiles: "Conan Exiles"
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
				}
				let con = new SourceCon(gServer.ip, gServer.port);
				try {
					con.connect(function(err) {
				    if (err) {
							console.log(err)
			        return
				    }
				    con.auth("rconpass", function(err) {
			        if (err) {
		            throw(err)
			        }
			        con.send("status", function(err, res) {
		            if (err) {
	                throw(err)
		            }
		            console.log("STATUS: "+res)
			        })
				    })
					})
				} catch (e) {
					console.log("foo")
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