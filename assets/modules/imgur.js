const https = require('https')

const imgurFunc = (message,q) => {
	let options = {
	  protocol:"https:",
	  host:"api.imgur.com",
	  path:"/3/gallery/search/top/all/0?q=" + encodeURI(q + "&q_type=jpg"),
	  headers:{"Authorization" : "Client-ID 0b4c755dbadd789"}
	}

	var req = https.request(options, function(response) {
	  var str = ''
	  response.on('data', function (chunk) {
	    str += chunk
	  });
	  response.on('end', function () {
			let json = JSON.parse(str),
					image = json.data[0] || null
			if (image != null) {
				message.channel.sendMessage(image.link)
			} else {
				message.channel.sendMessage("Nothing found")
			}
	  });
	});
	req.end();
}
module.exports = {
  get : imgurFunc
}
