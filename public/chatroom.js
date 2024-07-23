const socket = io();
const username = localStorage.getItem('username');

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        socket.emit('message', message);
        document.getElementById('message').value = '';
    }
}

socket.on('message', (msg) => {
    const item = document.createElement('li');
    item.textContent = `${msg.user}: ${msg.text}`;
    document.getElementById('messages').appendChild(item);
});

socket.on('user joined', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
});

socket.on('user left', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
});

// Notify the server that a user has joined
socket.emit('join', username);
