const request = require('request')
const cheerio = require('cheerio')
const wikiFunc = (bot,message,phrase) => {
  let url = "https://en.wikipedia.org/wiki/"+encodeURI(phrase);
	request(url, (error, response, html) => {
		if (!error && response.statusCode == 200) {
			try {
				let $ = cheerio.load(html)
				let article = {
					title:$("title").text() || null,
					url:url || null,
					body:$('#mw-content-text > p').eq(0).text() || null
				}
				message.channel.sendMessage("**" + article.title + "** <"+article.url+">\n```" + article.body + "```")
				message.author.sendMessage("Your message here.")
			} catch (e) {
				message.channel.sendMessage("Not found")
			}
		} else {
			message.channel.sendMessage("Not found")
		}
	})
}
module.exports = {
  get : wikiFunc
}
