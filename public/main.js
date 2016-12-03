var socket = io();
var chatForm = document.forms.chat;
var loginForm = document.forms.login;
var messageInput = chatForm.message;
var messageBox = document.querySelector("#messages");
var username = null;
var room = null;

function setUserInfo(){
    username = loginForm.username.value.trim();
    room = loginForm.room.value;
    if (username && room){
        document.querySelector(".login").style.display = 'none';
        document.querySelector(".chat").style.display = 'flex';
        socket.emit("add user", {username: username, room: room});
    }
}

function sendMessage(){
    socket.emit('chat message', {
        message: messageInput.value,
        username: username
    });
    messageInput.value = '';
}

function addLogMessage(message){
    var msgLi = document.createElement('LI');
    msgLi.classList.add('log');
    msgLi.innerHTML = message;
    messageBox.appendChild(msgLi);
}

function addMessage(data){
    var msgLi = document.createElement('LI');
    msgLi.classList.add('message');
    msgLi.innerHTML = '<span class="username">' + data.username + '</span>' + data.message;
    messageBox.appendChild(msgLi);
}

loginForm.onsubmit = function(){
    setUserInfo();
    return false;
};

chatForm.onsubmit = function(){
    sendMessage();
    return false;
};

socket.on('new user', function(username){
    addLogMessage(username + ' присоединился к чату');
});

socket.on('user disconnect', function(username){
    if(username)
        addLogMessage(username + ' вышел из чата');
});

socket.on('chat message', function(data){
    addMessage(data);
});