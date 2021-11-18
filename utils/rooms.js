const rooms = [];

function createNewRoom(id, username, roomnumber) {
    const room = { id, username, roomnumber };
    rooms.push(room);
    return room;
}

function checkRoomExists(roomnumber) {
    //console.log(rooms);
    return (rooms.findIndex(room => room.roomnumber === roomnumber) == -1);
}


module.exports = {
    createNewRoom,
    checkRoomExists
};