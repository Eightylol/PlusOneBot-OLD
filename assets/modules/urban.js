const urban = require('urban')


const urbanFunc = (bot,message,phrase) => {
  // console.log(phrase)
  let r = urban(phrase)
  r.first((json) => {
		if (typeof json != "undefined") {
			message.channel.sendMessage(json.permalink)
		} else {
			message.channel.sendMessage("Not found")
		}
  })
}
module.exports = {
  get : urbanFunc
}
