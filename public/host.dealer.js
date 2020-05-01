/*
p5.multiplayer - HOST

This 'host' sketch is intended to be run in desktop browsers. 
It connects to a node server via socket.io, from which it receives
rerouted input data from all connected 'clients'.

Navigate to the project's 'public' directory.
Run http-server -c-1 to start server. This will default to port 8080.
Run http-server -c-1 -p80 to start server on open port 80.
*/

const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server
// const serverIp = 'https://rorywalsh-wizard.glitch.me';
// const serverPort = "3000";
// const local = false; // true if running locally, false


let dealer; // main dealer object
let players; // main players object, this is NOT and array, it contains the player array
let numberOfPlayers = 2; // number of players in round



function setup() {
    //create out game object
    dealer = new Dealer();
    players = new Players();
    //add cards to game 
    dealer.setupNewGame(new Switch());
}


function onClientConnect(data) {
    //push each newly logged on player to gameState adding a unique IP and int ID each time
    players.addPlayer(new Player(data.id, players.getNumberOfPlayers()));
    dealer.setNumberOfPlayers(players.getNumberOfPlayers());

    // once all players have logged on, start new round...
    if (players.getNumberOfPlayers() === numberOfPlayers) {
        setTimeout(function() {
            startGame();
        }, 1000)
    }
}

//called to start a new game
function startGame() {
    let numberOfCards = 20;
    dealer.dealCardsToPlayers(numberOfCards, players);
    sendData("dealer", dealer);
    sendData("players", players);
}


//called each time a player sends data - after data is received, pass it out to all players
function onReceiveData(data) {
    if (data.type == "dealer") {
        dealer = Object.assign(new Dealer(), data);
        sendData("dealer", dealer);
    } else if (data.type == "players") {
        dealer = Object.assign(new Players(), data);
        sendData("players", players);
    }

}

//======================================================================================

function preload() {
    setupHost();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}

function draw() {
    if (isHostConnected((display = true))) {}
}


function onClientDisconnect(data) {

}