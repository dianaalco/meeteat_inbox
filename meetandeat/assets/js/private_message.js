function startPrivateConversation() {
	var select = $('#users-list');
	if(select.val() === null) {
		return alert('Please select an user to send a private message to.');
	}
	var recipientName = $('option:selected', select).text();
	var recipientId = select.val();

	var message = prompt("Enter a message to send to "+recipientName);

	createPrivateConversationRoom({name:recipientName, id:recipientId});
	addMessageToConversation(window.me.id, recipientId, message);

	io.socket.post('/chat/private', {to:recipientId, msg: message});
};

function createPrivateConversationRoom(penPal) {
	var roomName = 'private-room-'+penPal.id;
	if($('#'+roomName).length) {
		return;
	}

	var penPalName = penPal.name == "unknown" ? ("User #"+penPal.id) : penPal.name;
	var roomDiv = $('<div id="'+roomName+'"></div>');
	var roomHTML = 	'<h2>Private conversation with <span id="private-username-'+penPal.id+'">'+penPalName+'</span></h2>\n' +
                 	'<div id="private-messages-'+penPal.id+'" style="width: 50%; height: 150px; overflow: auto; border: solid 1px #666; padding: 5px; margin: 5px"></div>'+
                 	'<input id="private-message-'+penPal.id+'"/> <button id="private-button-'+penPal.id+'">Send message</button">';

    roomDiv.html(roomHTML);
    
    $('#convos').append(roomDiv);
    $('#private-button-'+penPal.id).click(onClickSendPrivateMessage);

};

function onClickSendPrivateMessage(e) {
	var button = e.currentTarget;
	var recipientId = button.id.split('-')[2];
	var message = $('#private-message-'+recipientId).val();
	$('#private-message-'+recipientId).val("");

	addMessageToConversation(window.me.id, recipientId, message);

	io.socket.post('/chat/private', {to: recipientId, msg: message});
};

function addMessageToConversation(senderId, recipientId, message) {
	var fromMe = senderId == window.me.id;
	var roomName = 'private-messages-' + (fromMe ? recipientId : senderId);
	var senderName = fromMe ? "Me" : $('#private-username-'+senderId).html();
	var justify = fromMe ? 'right' : 'left';

	var div = $('<div style="text-align:'+justify+'"></div>');
	div.html('<strong>'+senderName+'</strong>: '+message);
	$('#'+roomName).append(div);
};

function receivePrivateMessage(data) {
	var sender = data.from;

	createPrivateConversationRoom(sender);

	addMessageToConversation(sender.id, window.me.id, data.msg);
};