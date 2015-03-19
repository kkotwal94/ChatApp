var socket = io();
var count = 0;
var my_rooms = 0;
//on connection name for user
    
        socket.on('connect', function () {
        //console.log(socket.io.engine.id);
	//console.log(socket.Object);
	
	
});

	
   
    $('#chat-input > form').submit(function() {
       socket.emit('chat message', $('#chatInput').val());
       $('#chatInput').val('');
	 return false; 
     });

   socket.on('chat message', function(msg) {
	$('#messages').append($('<li>').text(msg));
	 $('#chatbox').animate({
        scrollTop: $('#chatbox')[0].scrollHeight});

	});
//console.log($('.input').val());
//alert($('.left > .input').val());
       
	$('#nickName > form').submit(function() {
	  
	  var nickName = $('#nickNames').val();
	     
	      
	      if (count > 0) {
		socket.emit('changenickname', $('#nickNames').val());
		}
	      if (count === 0) {
              socket.emit('adduser', $('#nickNames').val());
              count = 1;

                }

		
          $('#namespace').empty();
	  $('#namespace').append(nickName);
	//  $('loggedinAs').append(nickName);
	//console.log(socket.username);
	  return false;
	  
	
	});
	
	$('#joinServer > form').submit(function() {
	   var createdRoom = $('#createRoom').val();
	   //$('#servers').append($('<li>').text(createdRoom));	
	   socket.emit('create', createdRoom);
	   
	});
	
	
	$('#switchServ > form').submit(function() {
	var searchedRoom = $('#switch').val()
	   switchRoom(searchedRoom);
	});
       socket.on('updaterooms', function(rooms, current_room) {
	$("#servers").empty();
	my_rooms = rooms;
	$.each(rooms, function(key, value) {
	if(value == current_room) {
		$('#servers').append('<li>' + value + '<li>');
	}
	else {
		$('#servers').append('<li><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></li>');

	}

	});
	
 
});
	socket.on('updateusers', function(usernames) {
        $('#loggedinAS').empty();
	
	$.each(usernames, function(key, value) {
	   $('#loggedinAS').append('<li>' + value + '<li>');
	});
	});
	

		
	function switchRoom(room) {
                socket.emit('switchRoom', room);
		$('#currentLobby').empty();
	        $('#currentLobby').append(room);
        	
	}


 /* socket.on('connect', function () {
	socket.broadcast.emit('chat message', 'Welcome to the chat server!')
});*/
