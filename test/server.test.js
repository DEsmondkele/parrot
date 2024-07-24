const request = require('supertest');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client');

let server;
let io;
let app;
let clientSocket;

beforeAll((done) => {
    app = express();
    server = http.createServer(app);
    io = socketIo(server);

    app.use(express.static('public'));

    io.on('connection', (socket) => {
        socket.on('join', (name) => {
            socket.username = name;
            io.emit('user joined', `${name} joined the chat`);
        });

        socket.on('message', (msg) => {
            io.emit('message', { user: socket.username, text: msg });
        });

        socket.on('disconnect', () => {
            io.emit('user left', `${socket.username} left the chat`);
        });
    });

    server.listen(() => {
        const port = server.address().port;
        clientSocket = ioClient(`http://localhost:${port}`);
        clientSocket.on('connect', done);
    });
}, 20000);

afterAll((done) => {
    if (clientSocket) {
        clientSocket.close();
    }
    if (server) {
        server.close(done);
    }
}, 20000);  

describe('Chat Server', () => {
    test('should broadcast join message', (done) => {
        const name = 'TestUser';
        clientSocket.emit('join', name);
        clientSocket.on('user joined', (msg) => {
            expect(msg).toBe(`${name} joined the chat`);
            done();
        });
    }, 20000); 

    test('should broadcast messages', (done) => {
        const name = 'TestUser';
        const message = 'Hello, world!';
        clientSocket.emit('join', name);
        clientSocket.emit('message', message);
        clientSocket.on('message', (msg) => {
            expect(msg).toEqual({ user: name, text: message });
            done();
        });
    }, 20000); // Increase the timeout

    test('should broadcast leave message', (done) => {
        const name = 'TestUser';
        clientSocket.emit('join', name);
        clientSocket.on('user joined', () => {
            // Created a new client socket to listen for the leave message
            const newClientSocket = ioClient(`http://localhost:${server.address().port}`);
            newClientSocket.on('connect', () => {
                newClientSocket.on('user left', (msg) => {
                    expect(msg).toBe(`${name} left the chat`);
                    newClientSocket.close(() => done());
                });
            });
        });
    }, 20000); 
});
