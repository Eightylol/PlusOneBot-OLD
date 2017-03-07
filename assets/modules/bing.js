const bingFunc = (message,phrase) => {
	message.channel.sendMessage("http://lmgtfy.com/?q=" + encodeURI(phrase))
}

module.exports = {
  get : bingFunc
}
