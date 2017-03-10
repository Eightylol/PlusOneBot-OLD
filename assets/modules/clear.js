const ClearFunc = (message,commands,cb) => {
	if (!message.member.hasPermission('MANAGE_MESSAGES')) return
	let numMessages = parseInt(commands[1])
	if (!isNaN(numMessages) && numMessages > 0) {
		if (numMessages > 1) {
			message.channel.bulkDelete(numMessages).then(_deletedMessages => {
				cb(null,_deletedMessages.size + " messages deleted.")
			}).catch((e) => {
				e = JSON.parse(e.response.text)
				cb(e)
			})
		}
	}
}
module.exports = {
  get : ClearFunc
}
