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
const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server

let deck;
let plusPlayers, minusPlayers;
let numberOfPlayers = 0;
let createLink;
let linkCreated = false;
let currentBidder = 0;

let gameState;

function preload() {
    setupHost();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    plusPlayers = new Button(100, 100, 100, 100, "+", "red");
    minusPlayers = new Button(200, 100, 100, 100, "-", "red");
    createLink = new Button(500, 100, 200, 100, "Generate Game Link", "green");

    gameState = {
        players: [],
        score: null,
        cardData: null,
        dealer: 0,
        currentBidder: 0,
        playerToPlay: 0,
        cardsPlayedInCurrentHand: 0,
        handsPlayed: 0,
        cardsPlayed: [],
        state: 'dealing'
    };
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
    if (linkCreated) text(serverIp + "/?=" + roomId, 600, 250);

    textSize(50);
    fill("blue");
    fill(255);
    if (gameState.players.length > 0) {
        text(
            "Game Status: " +
            (gameState.players.length == numberOfPlayers ?
                "In Progress" :
                "Initiliasing"),
            400,
            400
        );
    } else text("Game Status: Unknown", 400, 400);

    plusPlayers.display();
    minusPlayers.display();
    createLink.display();

    if (isHostConnected((display = true))) {}
}

function onClientConnect(data) {
    //console.log(data.id + " has connected.");

    gameState.players.push({
        id: data.id,
        number: gameState.players.length,
        bid: -1,
        turn: false,
        handsWon: 0,
        score: 0,
        currentCard: { suit: '', value: -1 }

    });

    if (gameState.players.length == numberOfPlayers) {
        deck = new Cards();
        deck.deal(11, gameState.players.length);
        gameState.cardData = deck;
        gameState.currentBidder = currentBidder;
        currentBidder++;
        gameState.state = 'bidding';
        sendData("gameState", gameState);
        // print(gameState);
    }
}

var numMousePresses = 0;

function mousePressed() {
    if (plusPlayers.hitTest() == true) {
        numberOfPlayers++;
    }

    if (minusPlayers.hitTest() == true) {
        numberOfPlayers = numberOfPlayers > 0 ? numberOfPlayers - 1 : 0;
    }

    if (createLink.hitTest() == true) {
        linkCreated = true;
    }
    if (gameState.players.length > 0) {
        if (numMousePresses == 0) {} else if (numMousePresses == 1) {}

        numMousePresses++;
    }
}

function onClientDisconnect(data) {}

function onReceiveData(data) {
    // Input data processing here. --->

    if (data.type == "gameState") {
        gameState = data;

        //game is still in bidding process
        if (gameState.state == 'bidding') {
            gameState.currentBidder = currentBidder;

            //check bidding has finished
            if (currentBidder == gameState.players.length) {
                gameState.playerToPlay = gameState.dealer + 1;
                gameState.state = 'playing';
                currentBidder = -10;
                gameState.dealer++;
            }
            currentBidder++;
        }
        //game is in progress...
        else if (gameState.state == 'playing') {
            // print("CurrentPlayer ", gameState.playerToPlay);
            gameState.playerToPlay = (gameState.playerToPlay < gameState.players.length - 1 ? gameState.playerToPlay + 1 : 0);
            // print("Hands played========");
            // console.log(gameState.cardsPlayedInCurrentHand);
            if (gameState.cardsPlayedInCurrentHand == gameState.players.length) {

                var wizardWasPlayed = false;
                //player played a wizard...
                for (card of gameState.cardsPlayed) {
                    // print(card);
                    if (card.number == 'w') {
                        print("Player " + card.player + " has won this round");
                        gameState.players[card.player].handsWon++;
                        wizardWasPlayed = true;
                        sendData('roundFinished', { winner: card.player });
                    }
                }
                if (wizardWasPlayed == false) {
                    // print(card);
                    var max = gameState.cardsPlayed[0].number;
                    print(gameState.cardsPlayed[0].number);
                    for (var i = 1; i < gameState.cardsPlayed.length; i++) {
                        print(gameState.cardsPlayed[i].number);
                        if (gameState.cardsPlayed[i].number > max) {
                            max = gameState.cardsPlayed[i].number;
                        }
                    }

                    for (card of gameState.cardsPlayed) {
                        if (card.number == max) {
                            print("Player " + card.player + " has won this round");
                            gameState.players[card.player].handsWon++;
                            sendData('roundFinished', { winner: playerIndex });
                        }
                    }


                }
            }

        }


        sendData("gameState", gameState);
        //print(gameState);
    }
}