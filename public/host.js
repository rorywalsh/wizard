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

//main dealer class
let dealer;
//number of players in round
let numberOfPlayers = 2;



function setup() {
    //create out game object
    dealer = new GameDealer();
    //add cards to game 
    dealer.createNewGame(new Switch());
}

//called to start a new game
function startGame() {
    let numberOfCards = 20;
    dealer.dealCards(numberOfCards);
    sendData("gameState", dealer);
}

function onClientConnect(data) {
    //push each newly logged on player to gameState adding a unique IP and int ID each time
    dealer.addPlayer(new CardPlayer(data.id, dealer.getNumberOfPlayers()));

    // once all players have logged on, start new round...
    if (dealer.getNumberOfPlayers() === numberOfPlayers) {
        setTimeout(function() {
            startGame();
        }, 1000)
    }
}

//called each time a player sends data - after data is received, pass it out to all players
function onReceiveData(data) {
    if (data.type == "gameState") {
        dealer = Object.assign(new GameDealer(), data);
        // console.log(dealer.playerUp);
    }
    sendData("gameState", dealer);
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