$(function() {
  $.post('/messages', function(data) {
		$('#debug').html(JSON.stringify(data,null,2))
		data.forEach(message => {
			$('.log-messages').append(() => {
				let messageElem = $('<div class="message-entry">')
				let messageAvatar = $('<img src="' + (message.avatar != null ? message.avatar : "/public/img/no-avatar.png")		 + '">').appendTo(messageElem)

				let messageInner = $('<div class="inner">')

				let messageHeader = $('<h3 class="title">')
				messageHeader.html(message.username + ' <small><span class="muted"><i>in</i></span> ' + message.channel + " @ " + '<span class="time">'+ $.timeago(message.createdAt) +'</span>' + "</small>")
				let messageContent = $('<div class="content">')
				messageContent.text(message.content)

				messageHeader.add(messageContent).appendTo(messageInner)
				messageInner.appendTo(messageElem)
				return messageElem
				console.log(messageElem)
			})
		})
  });
})
