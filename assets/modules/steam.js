const SteamApi = require('steam-api')
const app = new SteamApi.App('729B074D90A891022A35C2C45D9CA03B');
const appNews = new SteamApi.News('729B074D90A891022A35C2C45D9CA03B');

let appList;

app.GetAppList().done(function(result){
	appList = result
	console.log("Steam: app list updated... ("+appList.length+" titles)")
})

const OutputGameInfo = (message,appId) => {
	app.appDetails(appId).done(function(g){
		appNews.GetNewsForApp(
			appId,
			optionalCount = 10,
			optionalMaxLength = 10
		).done(function(gNews){
			var gDesc = g.description.replace(/(<([^>]+)>)/ig,"").substring(0, 500) + "...\n\n"
			for (var i = 0; i < gNews.newsitems.length; i++) {
				let newsItem = gNews.newsitems[i]
				gDesc += "**"+newsItem.title+"** "+newsItem.url+"\n"
			}
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
		console.log("top")
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
