const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('join', (name) => {
        socket.username = name;
        io.emit('user joined', `${name} joined the chat`);
    });

    socket.on('message', (msg) => {
        io.emit('message', { user: socket.username, text: msg });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        io.emit('user left', `${socket.username} left the chat`);
    });
});
const isTest =  process.env.NODE_ENV === 'test';

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    if (!isTest) {
        console.log(`Server is running on port ${PORT}`);
    }
});
