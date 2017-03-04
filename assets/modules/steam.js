const SteamApi = require('steam-api')
const Settings = require(require('path').dirname(require.main.filename) + "\\settings.js")
const app = new SteamApi.App(Settings.steam.apikey)
const appNews = new SteamApi.News(Settings.steam.apikey)
const toMarkdown = require('to-markdown')
const q = require('q')
let appList;

app.GetAppList().done(function(result){
	appList = result
	console.log("Steam: app list updated... ("+appList.length+" titles)")
})

const OutputGameInfo = (message,appId) => {
	app.appDetails(appId).done(function(g){
		// console.log(g)
		appNews.GetNewsForApp(
			appId,
			optionalCount = 3,
			optionalMaxLength = 10
		).done(function(gNews){
			let description = toMarkdown(g.description).substring(0,650)

			var gDesc = "";

			gDesc += 	".\n\n__**"+g.name+"**__\n"
			// if (typeof g.metacritics != "undefined") {

			if (typeof g.metacritic != "undefined" && g.metacritic.score && g.metacritic.url) {
				gDesc +=	"Metacritics: "
				let metacritics = []
				for (var i = 0; i < g.metacritic.length; i++) {
					let metacritic = g.metacritic[i]
					metacritics.push("**" + metacritic.score + "** <" + metacritic.url + ">")
				}
				gDesc += " **" + metacritics.join("** **") + "** \n"
			}

			if (typeof g.price != "undefined" && g.price.currency && g.price.initial && g.price.final) {
				let price = g.price.final+" ".trim()
				price = price.substring(0,price.length-2)+".00"
				gDesc +=	"Price: " + price+ " " + g.price.currency.toLowerCase() + "\n"
			}

			if (typeof g.categories != "undefined" && g.categories.length > 0) {
				gDesc += "Categories: "
				let categories = []
				for (var i = 0; i < g.categories.length; i++) {
					let category = g.categories[i]
					categories.push(category.description)
				}
				gDesc += " **" + categories.join("** **") + "** \n"

			}

			if (typeof g.genres != "undefined" && g.genres.length > 0) {
				gDesc += "Genres: "
				let genres = []
				for (var i = 0; i < g.genres.length; i++) {
					let genre = g.genres[i]
					genres.push(genre.description)
				}
				gDesc += " **" + genres.join("** **") + "** \n"
			}
			console.log(g)
			gDesc += g.header + "\n"
			message.channel.sendMessage(gDesc);
		});
	});
}

const InitGameInfo = (message,q) => {
	if (appList.length > 0) {
		for (var i = 0; i < appList.length; i++) {
			let game = appList[i];
			if (game.name.toLowerCase().replace(["-"]," ").replace(":"," ").replace("  "," ").indexOf(q.toLowerCase()) != -1) {
				let appId = game.appid
				OutputGameInfo(message,appId);
				return
			}
		}
		message.channel.sendMessage(q + " not found...");
	}
}

const SearchArrToString = (search) => {
	search.shift()
	return search.join(" ")
}

const ParseParams = (message,search) => {
	let q = search[0]
	if (q == "game") {
			search = SearchArrToString(search)
			InitGameInfo(message,search)
			return
	} else if(q == "top") {
		message.channel.sendMessage("Top not implemented yet.");
	}
}

const steamFunc = (error,message,search) => {
	if (error != null) {
		message.channel.sendMessage(search)
		return
	}
	search = search.split(" ")
	if (search[0].trim() == "") {
		search.shift()
	}
	if (search.length > 0) {
		ParseParams(message,search)
	}
}

module.exports = {
  get : steamFunc
}
