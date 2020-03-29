const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Chatroom Bots';

// Run when client connects
io.on('connection', socket => {
  
  // Welcome current user
  socket.emit('message', formatMessages(botName, 'Welcome to Chatroom!'));

  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessages(botName, 'A user has joined the chat!'));

  // Runs when client disconnects
  socket.on('disconnect', ()=> {
    io.emit('message', formatMessages(botName, 'Welcome to Chatroom!'));
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessages('USER', msg));
  });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
