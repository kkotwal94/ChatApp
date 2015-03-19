var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;
var express = require('express');
var path = require('path');

//app.use(express.static(path.join(__dirname, 'chat_app')));
//setting up our port
http.listen(port, function() {
console.log('Server is listening on port... ' + port);
});

//usernames connected to the chat
var usernames = {};
var numUsers = 0;
var rooms = ['Lobby','Dota 2 Chat','Joke Chat'];
//routing to our index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname +'/'));



//socket io, connected pls, server stuff
io.on('connection', function(socket) {

  socket.on('adduser', function(username) {
    socket.username = username;
    //adding our name to the global scope
    //console.log(username);
    socket.room = 'Lobby';
    usernames[username] = username;
    io.emit('updateusers', usernames);
    //usernames[username] = socket;
    //say this user has connected to client
    socket.join('Lobby');
    numUsers++;
    socket.broadcast.emit('chat message', socket.username + ' has connected to the room')
    socket.broadcast.to('Lobby').emit('chat message', socket.username+' has connected to this Lobby');
    socket.emit('updaterooms',rooms,'Lobby');

});
//creating our own server?
  socket.on('create', function(room) {
    rooms.push(room);
    socket.emit('updaterooms', rooms, socket.room);
  });
  

socket.on('changenickname', function(new_username) {
   var temp;
   temp = usernames[socket.username];
   delete usernames[socket.username];
   socket.username = new_username;
   usernames[new_username] = new_username;
   io.emit('updateusers', usernames);
   //usernames[new_username] = socket;
   io.emit('chat message', temp +' has changed his name to ' + socket.username)
	});

  socket.on('chat message', function(msg) {
   io.sockets.in(socket.room).emit('chat message', socket.username + ': '+ msg); 
});

  socket.on('switchRoom', function(newroom) {
	var oldroom;
	oldroom = socket.room;
	socket.leave(socket.room);
	socket.join(newroom);
	socket.emit('chat message', 'you have connected to ' + newroom);
	socket.broadcast.to(oldroom).emit('chat message', socket.username + ' has left this room');
	socket.room = newroom;
	socket.broadcast.to(newroom).emit('chat message', socket.username+' has joined the room!');
	socket.emit('updaterooms',rooms, newroom);
	});

  socket.on('disconnect', function() {
    //removes the username from global array of username
    delete usernames[socket.username];
    numUsers--;
    //update list of users in chat, client side
    io.emit('updateusers', usernames);
    //tell chat room user has left
    socket.broadcast.emit('chat message', socket.username + ' has disconnected');
    socket.leave(socket.room);
});
  
 socket.on('removeRoom', function(currRoom, nextRoom) {
	for (var i = 0; i < rooms.length; i++)  { //cant delete lobby!
	   if (rooms[i] === currRoom){
		   rooms[i] = nextRoom;
	}	
    }
   
});
   socket.on('getUsers', function() {
	socket.emit('updateusers', usernames);
	});

});




/*setInterval(function() {
	for(var i = 0; i < usernames.length; i++) {
	console.log(usernames[i]);	
	}
},1000);
*/




