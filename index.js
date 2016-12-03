const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on("connection", (socket) => {
    let addedUser = false;

    socket.on("add user", (data) => {
        if (addedUser) return;
        socket.username = data.username;
        socket.room = data.room;
        addedUser = true;
        socket.join(data.room);
        socket.broadcast.to(socket.room).emit("new user", socket.username);
    });

    socket.on("chat message", (data) => {
        io.to(socket.room).emit('chat message', data);
    });

    socket.on("disconnect", () => {
        socket.broadcast.to(socket.room).emit("user disconnect", socket.username);
    });
});

app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
    res.status(500).send('500 Server Error');
});

http.listen(port);