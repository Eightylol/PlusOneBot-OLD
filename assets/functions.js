const SendMessage = (message,content) => {
	let channelName = message.channel.name;
	var channel = bot.channels.find("name", channelName);
	channel.sendMessage(content)
}
