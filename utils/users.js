const users = [];

// Add new user to User array
function userJoin(id, username, roomnumber, roleId) {
    const user = { id, username, roomnumber, roleId };
    users.push(user);
    return user;
}

// Get Current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function getUsersFromRoom(roomnumber) {
    return users.filter(user => user.roomnumber === roomnumber);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getUsersFromRoom
};