const http = require('http');
const express = require('express');
const app = express();
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const path  = require('path')
const messages = {};

app.get("/aja",(req,res)=>{
  res.sendFile(path.join(__dirname,'mentordetails.html'));
})

io.on('connection', (socket) => {
  console.log('New client connected'); 
  socket.emit('initialMessages', messages);  
  socket.on('newMessage', (message) => {
    const messageId = Date.now();
    messages[messageId] = message;
    io.emit('newMessage', message);  
  }); 
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}); 
server.listen(5500,"localhost",() => {
  console.log('Server listening on port 5500');
});
 