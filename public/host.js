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

//main game class
let game;
//number of players in round
let numberOfPlayers = 2;

function preload() {
    setupHost();
    
}

function setup() {
    //create out game object
    game = new GameState();
    //add cards to game 
    game.addCards(Cards.createDeck(12, ['red', 'blue', 'green', 'orange'], []));

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}

function draw() {
    if (isHostConnected((display = true))) {}
}

function onClientDisconnect(data) {

}

function onClientConnect(data) {
    //push each newly logged on player to gameState adding a unique IP and int ID each time
    game.addPlayer(new Player(data.id, game.getNumberOfPlayers()));

    // once all players have logged on, start new round...
    if (game.getNumberOfPlayers() === numberOfPlayers) {
        setTimeout(function() {
            startGame();
        }, 1000)
    }
}

//called to start a new game
function startGame(){
    let numberOfCards = 5;
    game.dealCards(numberOfCards);
    //send datra to players
    console.log(game);
    sendData("gameState", game);
}

//called each time a player sends data
function onReceiveData(data) {
    if (data.type == "gameState") {
        game = data;

    }
}