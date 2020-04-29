////////////
// COMMON

// Initialize Network related variables
let socket;
let roomId = null;
let id = null;

// Process URL
// Used to process the room ID. In order to specify a room ID,
// include ?=uniqueName, where uniqueName is replaced with the 
// desired unique room ID.
function _processUrl() {
    const parameters = location.search.substring(1).split("&");

    const temp = parameters[0].split("=");
    roomId = unescape(temp[1]);

    console.log("id: " + roomId);
}

// Send data from client to host via server
function sendData(datatype, data) {
    data.type = datatype;
    data.roomId = roomId;

    socket.emit('sendData', data);
}

// Initialize Network related variables
let hostConnected = false;

function setupHost() {
    _processUrl();

    let addr = serverIp;
    if (local) { addr = serverIp + ':' + serverPort; }
    socket = io.connect(addr);

    socket.emit('join', { name: 'host', roomId: roomId });

    socket.on('id', function(data) {
        id = data;
        console.log("id: " + id);
    });

    socket.on('hostConnect', onHostConnect);
    socket.on('clientConnect', onClientConnect);
    socket.on('clientDisconnect', onClientDisconnect);
    socket.on('receiveData', onReceiveData);
}

function isHostConnected(display = false) {
    if (!hostConnected) {
        return false;
    }
    return true;
}

function onHostConnect(data) {
    console.log("Host connected to server.");
    hostConnected = true;

    if (roomId === null || roomId === 'undefined') {
        roomId = data.roomId;
    }
}

////////////
// CLIENT

// Initialize Network related variables
let waiting = true;
let connected = false;

function setupClient() {
    _processUrl();

    // Socket.io - open a connection to the web server on specified port
    let addr = serverIp;
    if (local) { addr = serverIp + ':' + serverPort; }
    socket = io.connect(addr);

    socket.emit('join', { name: 'client', roomId: roomId });

    socket.on('id', function(data) {
        id = data;
        console.log("id: " + id);
    });

    socket.on('found', function(data) {
        connected = data.status;
        waiting = false;
        console.log("connected: " + connected);
    })

    socket.emit('clientConnect', {
        roomId: roomId
    });

    socket.on('receiveData', onReceiveData);
}

function isClientConnected(display = false) {
    if (waiting) {
        if (display) { _displayWaiting(); }
        return false;
    } else if (!connected) {
        if (display) { _displayInstructions(); }
        return false;
    }

    return true;
}