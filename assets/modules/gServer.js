const Settings = require(__dirname + "\\..\\..\\settings.js"),
			SteamApi = require('steam-api'),
			app = new SteamApi.App(Settings.steam.apikey),
			request = require('request')

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
	let ip = ipAndPort.split(":")[0],
			port = ipAndPort.split(":")[1],
			_url = "http://localhost?ip=" + ip + "&port=" + port
	request.get(_url, (e,r,bo) => {
		let j = {}
		try {
			j = JSON.parse(bo)
		} catch (e) {
			cb(null,e.message)
			return
		} finally {
			cb(null,j)
		}
		return
	})
}
module.exports = {
  get : gServerFunc
}
