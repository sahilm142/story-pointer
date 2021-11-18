const socket = io();

/**
 * CardList: list of cards displayed to the user on joining the room
 * As of now hardcoded, future -> Admin(the one who creates the room can decide the values & numbers of cards)
 * */

let cardList = [1, 2, 3, 5, 8, 13, '?'];

const adminId = 1;
const guestId = 2;

const roomnumber = $('#room').val();
const username = $('#name').val();

//Join Room
function joinRoom() {
    socket.emit('joinRoom', { username, roomnumber, guestId});
}

function createRoom() {

    socket.emit('createRoom', { username, roomnumber, adminId});
}

socket.on('message', message => {
    console.log(message.username, message.text);
});

socket.on('addUser', (data) => {
    addUserToDashboard(data.userName);
});

/**
 * Room Created 
 * Show the deck of cards 
 * */

socket.on('roomCreated', (data) => {
    $('#joiningForm').addClass('hide');
    $('#users').removeClass('hide');
    $('#users').append('<h3>Welcome to Room: ' + data.roomNumber + '</h3>');
    $('#game').removeClass('hide');
    //cardList.push(data.roomNumber);
    addUserToDashboard(data.userName);
});

/**
 * On Joining the room
 * Show the deck of card for that specific room
 * Show the user joined
 * */

socket.on('roomJoined', (data) => {
    $('#joiningForm').addClass('hide');
    $('#users').removeClass('hide');
    $('#users').append('<h3>Welcome to Room: ' + roomnumber + '</h3>');
    $('#game').removeClass('hide');
    addUserToDashboard(data.userName);
    //cardList.push(data.roomnumber + 2);
});


createCardDeck();
createUserDashboard();

/**
 * Create deck of cards
 * On click display the symbol of the card (Open the card)
 * At one time only one card can be open (close the other)
 * If access to open the card then only display or change the options
 * */

function createCardDeck() {
    const deck = $('<div>', { id: 'deck', class: 'deck' });
    $('#game').append(deck);
    cardList.forEach(createCard);
}

/**
 * Create User Dashboard
 * Show all the Users present in the current room
 * Show Points after clicking on flip card button wrt user
 * */
function createUserDashboard() {
    const dashboard = $('<ul>', { id: 'dashboard', class: 'dashboard' });
    $('#game').append(dashboard);
}

/**
 * Creates the card available to vote
 * @param {any} card    : the number displaying on the card
 * 
 */
function createCard(card) {
    const c = $('<button id= card_'+ card +'>' + card + '</button>');
    c.addClass('card');
    $('#deck').append(c);
}
/**
 * Adds the username to the user dashboard
 * @param {any} username    : Name of the user, displayed on the dashboard
 * 
 */
function addUserToDashboard(username) {
    const user = $('<li>'+username+'</li>');
    $('#dashboard').append(user);
}

/**
 * Add Event Listener on buttons
 * */
cardList.forEach(card => {
    $('#card_' + card).click(() =>
    {
        console.log('you voted ' + card + 'Mr. ' + username);
        socket.emit('userVoted', {username, roomnumber} );
    });
});
