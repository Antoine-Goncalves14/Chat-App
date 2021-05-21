const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const ms = require('ms');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg);
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port} !`);
});