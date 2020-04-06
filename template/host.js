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
let plusPlayers, minusPlayers;
let numberOfPlayers = 0;
let createLink;
let linkCreated = false;
let currentBidder = 0;

function preload() {
    setupHost();
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    plusPlayers = new Button(100, 100, 100, 100, '+', 'red');
    minusPlayers = new Button(200, 100, 100, 100, '-', 'red');
    createLink = new Button(500, 100, 200, 100, 'Generate Game Link', 'green');

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(15);
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Number of players: " + numberOfPlayers.toString(), 200, 250);
    if (linkCreated)
        text(serverIp + "/?=" + roomId, 600, 250);

    textSize(50);
    fill('blue');
    //rect(360, 180, 200, 100);
    fill(255);
    if (players.length > 0) {
        text("Game Status: " + (players.length == numberOfPlayers ? "In Progress" : "Initiliasing"), 400, 400);
    } else
        text("Game Status: Unknown", 400, 400);


    plusPlayers.display();
    minusPlayers.display();
    createLink.display();

    if (isHostConnected(display = true)) {
        // Host/Game draw here. --->


        // <----

        // Display server address
        // displayAddress();
    }



}

function onClientConnect(data) {

    console.log(data.id + ' has connected.');
    players.push({ id: data.id, number: players.length, currentDealer: false, bid: 0, turn: false })
    print(players.length);
    print(numberOfPlayers);
    if (players.length == numberOfPlayers) {
        sendData('playerData', { players });
        deck = new Cards();
        deck.deal(11, players.length);
        sendData('cardData', { deck });
        sendData('bidding', { number: currentBidder });
        currentBidder++;

    }

}

var numMousePresses = 0;

function mousePressed() {

    if (plusPlayers.hitTest() == true) {
        numberOfPlayers++;
    }

    if (minusPlayers.hitTest() == true) {
        numberOfPlayers = (numberOfPlayers > 0 ? numberOfPlayers - 1 : 0);
    }

    if (createLink.hitTest() == true) {
        linkCreated = true;
    }
    if (players.length > 0) {
        if (numMousePresses == 0) {

        } else if (numMousePresses == 1) {

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
    console.log(data);
    if (data.type == 'cardPlayed') {
        for (player of players) {
            if (player.id == data.id) {
                print("Player:", player.number, "just played a", data.number, "of ", data.suit.toString('rgba%'));
            }
        }
    }

    if (data.type == "incomingBid") {
        for (player of players) {
            if (player.number == data.playerNumber) {
                player.bid = data.bid;
            }
        }

        sendData('playerData', { players });
        sendData('bidding', { number: currentBidder });
        // print("currentBidder", currentBidder);
        // print("numberOfPlayer", numberOfPlayers);
        if (currentBidder == numberOfPlayers) {
            print("Bidding has completed for this round");
        }
        currentBidder++;

    }

    // <---

    /* Example:
       if (data.type === 'myDataType') {
         processMyData(data);
       }

       Use `data.type` to get the message type sent by client.
    */

}