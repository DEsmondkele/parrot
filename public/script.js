const socket = io();
let username;

function joinChat() {
    username = document.getElementById('name').value;
    if (username) {
        // Store the username in localStorage or query parameters
        localStorage.setItem('username', username);
        window.location.href = 'chatroom.html';
    }
}


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
