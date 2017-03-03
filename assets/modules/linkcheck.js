const http = require('follow-redirects').http
const https = require('follow-redirects').https

const ShowLink = (message,responseUrl) => {
  message.channel.sendMessage(responseUrl)
}

const getLink = (message,res) => {
  var page = '';
  res.on('data', function (chunk) {
    page += chunk;
  })
  res.on('end', function() {
		console.log(res)
    ShowLink(message,res.responseUrl)
  })
}

const checkLink = (link,message,cb,bot) => {
	if (link == null) {
		let currChannel = {
			id: message.channel.id,
			name: message.channel.name
		}
		let channels = Array.from(bot.channels)
		for (var i = 0; i < channels.length; i++) {
			let channel = channels[i][1];
			if (channel.id == currChannel.id) {
				console.log(Array.from(channel.messages))
				break;
			}
		}
		return
	}
  try {
    https.get(link, function(res) {
      getLink(message,res)
    })
  } catch (r) {
    try {
    http.get(link, function(res) {
        getLink(message,res)
      })
    } catch (r) {
      console.log(r)
      message.reply("Mismatch or invalid link " + link)
    }
  }
}

module.exports = {
  ShowLink : ShowLink,
  getLink : getLink,
  checkLink : checkLink
}
