io.socket.on('connect', function socketConnected() {
	$('#disconnect').hide();
	$('#main').show();
	io.socket.get("/user/announce", function(data) {
		window.me = data;
		updateMyName(data);
		io.socket.get('/user', updateUserList);
		io.socket.get('/room', updateRoomList);
	});

	io.socket.on('room', function messageReceived(message) {
		switch(message.verb) {
			case 'created':
			addRoom(message.data);
			break;

			case 'addedTo':
			postStatusMessage('room-messages-'+message.id, $('#user-'+message.addedId).text()+' has joined');
			increaseRoomCount(message.id);
			break;

			case 'removedFrom':
			postStatusMessage('room-messages-'+message.id, $('#user-'+message.removeId).text()+' has left');
			decreaseRoomCount(message.id);
			break;
			
			case 'destroyed':
			removeRoom(message.id);
			break;

			case 'messaged':
			receiveRoomMessage(message.data);
			break;

			default:
			break;
		}
	});
	io.socket.on('user', function messageReceived(message) {
		switch(message.verb) {
			case 'created':
			addUser(message.data);
			break;

			case 'updated':
			var oldName = $('#user-'+message.id).text();
			$('#user-'+message.id).text(message.data.name);

			if($('#private-username-'+message.id).length) {
				$('#private-username-'+message.id).html(message.data.name);
				postStatusMessage('private-messages-'+message.id,oldName+' has changed their name to '+message.data.name);
			}
			break;

			case 'destroyed':
			removeUser(message.id);
			break;

			case 'messaged':
			receivePrivateMessage(message.data);
			break;

			default:
			break;
		}
	});

	$('#update-name').click(updateName);
	$('#private-msg-button').click(startPrivateConversation);
	$('#join-room').click(joinRoom);
	$('#new-room').click(newRoom);
	console.log('Socket is now connected!');

	io.socket.on('disconnect', function() {
		$('#main').hide();
		$('#disconnect').show();
	});
});