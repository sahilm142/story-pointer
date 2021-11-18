//'use strict';
const http = require('http');

const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getUsersFromRoom } = require('./utils/users');
const { createNewRoom, checkRoomExists} = require('./utils/rooms');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Darth Vader';

/*
 socket.emit: to current user
 socket.broadcast.emit: to all the user except the connecting user
 */

// run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', (data) => {

        const roomNumber = data.roomnumber,
            userName = data.username,
            roleId = data.roleId;
        //check if room exists
        if (checkRoomExists(roomNumber)) {
            socket.emit('message', formatMessage(`Room ${roomNumber} doesn't exist, try creating new!`));
            return;
        }

        const user = userJoin(socket.id, userName, roomNumber, roleId);

        socket.join(user.roomnumber);

        const usersInRoom = getUsersFromRoom(roomNumber);

        //console.log(usersInRoom)

        socket.emit('roomJoined', { userName, usersInRoom });

       // io.sockets.in(roomnumber).emit('roomJoined', { username, roomnumber });

        console.log(`welcome to room ${roomNumber} ${userName}`);

        socket.emit('message', formatMessage(adminName, 'welcomes you in plan it poker'));

        //Broadcast when a user connects
        socket.broadcast.to(roomNumber).emit('message', formatMessage(user.username, ' has joined the plan it poker'));
        socket.to(roomNumber).emit('addUser', { userName });

    });

    socket.on('createRoom', (data) => {

        const roomNumber = data.roomnumber,
            userName = data.username,
            roleId = data.roleId;

        if (!checkRoomExists(roomNumber)) {
            socket.emit('message', formatMessage(`Room ${roomNumber} already exist, join other room/create new!`));
            return;
        }

        console.log(`${userName} created a new room ${roomNumber}`);

        //

        const newRoom = createNewRoom(socket.id, userName, roomNumber);

        //Add creater of the room to user table

        socket.emit('message', formatMessage(newRoom.username, ` created a new room ${newRoom.roomnumber} `));
        socket.join(newRoom.roomnumber);

        const user = userJoin(socket.id, userName, roomNumber, roleId);
        socket.join(user.roomnumber);

        socket.emit('roomCreated', { roomNumber, userName });

    });

    socket.on('userVoted', (data) => {

        console.log(`voting started in ${data.roomnumber}`);

        //Broadcast to the room when a user votes
        socket.broadcast.to(data.roomnumber).emit('message', formatMessage(data.username, ' has voted '));
    });


    //When user disconnect
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the game');
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
