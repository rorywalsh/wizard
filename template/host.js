/*
p5.multiplayer - HOST

This 'host' sketch is intended to be run in desktop browsers. 
It connects to a node server via socket.io, from which it receives
rerouted input data from all connected 'clients'.

Navigate to the project's 'public' directory.
Run http-server -c-1 to start server. This will default to port 8080.
Run http-server -c-1 -p80 to start server on open port 80.

*/

////////////
// Network Settings
// const serverIp      = 'https://yourservername.herokuapp.com';
// const serverIp      = 'https://yourprojectname.glitch.me';
const serverIp = '127.0.0.1';
const serverPort = '3000';
const local = true; // true if running locally, false
// if running on remote server

var players = [];
let deck;

function preload() {
    setupHost();
}

function setup() {
    createCanvas(windowWidth, windowHeight);


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(15);

    if (isHostConnected(display = true)) {
        // Host/Game draw here. --->


        // <----

        // Display server address
        displayAddress();
    }
}

function onClientConnect(data) {

    console.log(data.id + ' has connected.');
    players.push({ id: data.id, number: players.length, currentDealer: false })
    print(players.length);

}

var numMousePresses = 0;

function mousePressed() {

    if (players.length > 0) {
        if (numMousePresses == 0) {
            sendData('playerData', { players });
        } else if (numMousePresses == 1) {
            deck = new Cards();
            deck.deal(11, players.length);
            sendData('cardData', { deck });
        }

        numMousePresses++;



    }


}


function onClientDisconnect(data) {
    // Client disconnect logic here. --->
    //console.log(data.id + ' has disconnected.');

    // <----
}

function onReceiveData(data) {
    // Input data processing here. --->
    //console.log(data);
    if (data.type == 'cardPlayed') {
        for (player of players) {
            if (player.id == data.id) {
                print("Player:", player.number, "just played a", data.number, "of ", data.suit.toString('rgba%'));
            }
        }
    }

    // <---

    /* Example:
       if (data.type === 'myDataType') {
         processMyData(data);
       }

       Use `data.type` to get the message type sent by client.
    */

}