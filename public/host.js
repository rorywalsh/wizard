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
// const serverIp = 'https://rorywalsh-wizard.glitch.me';
// const serverPort = "3000";
// const local = false; // true if running locally, false

let hands;
let plusPlayers, minusPlayers;
let numberOfPlayers = 3;
let createLink;
let linkCreated = false;
let gameState;

function preload() {
    setupHost();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    //plusPlayers = new Button(100, 100, 100, 100, "+", "red");
    //minusPlayers = new Button(200, 100, 100, 100, "-", "red");
    //createLink = new Button(500, 100, 200, 100, "Generate Game Link", "green");

    gameState = {
        players: [],
        currentCards: [],
        score: 0,
        cardData: null,
        dealer: 0,
        round: 4,
        currentBidder: 0,
        numberOfBids: 0,
        winnerOfHand: -1,
        playerToPlay: 0,
        cardsPlayedInCurrentHand: 0,
        tricksPlayed: 0,
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

    // plusPlayers.display();
    // minusPlayers.display();
    // createLink.display();

    if (isHostConnected((display = true))) {}
}

function startNewRound() {
    hands = new Cards();
    hands.deal(gameState.round, gameState.players.length);
    gameState.cardData = hands;
    gameState.state = 'bidding';
    sendData("gameState", gameState);
}

function onClientConnect(data) {

    //push each newly logged on player to gameState
    gameState.players.push({
        id: data.id,
        number: gameState.players.length,
        bid: -1,
        turn: false,
        handsWon: 0,
        score: 0,
        name: '',
        currentCard: { suit: '', value: -1 }
    });

    // once all players have logged on, start new round...
    if (gameState.players.length == numberOfPlayers) {
        setTimeout(function() {
            startNewRound();
        }, 1000)

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
            print("CurrentBidder", gameState.currentBidder);
            //check bidding has finished
            if (gameState.numberOfBids == gameState.players.length) {
                gameState.state = 'playing';
                //gameState.playerToPlay = (gameState.currentDealer < gameState.players.length ? gameState.currentDealer + 1 : 0);
                print("======== Playing state ========");
                print("Player to play:", gameState.playerToPlay);
            }
        }
        //game is in progress...
        else if (gameState.state == 'playing') {
            if (gameState.cardsPlayedInCurrentHand == gameState.players.length) {
                var wizardWasPlayed = false;

                //first player to play a wizard wins the hand...
                for (card of gameState.cardsPlayed) {
                    if (card.number == 'w') {
                        print("Player " + card.player + " has won this hand");
                        gameState.players[card.player].handsWon++;
                        wizardWasPlayed = true;
                        gameState.winnerOfHand = card.player;
                    }
                }
                if (wizardWasPlayed == false) {
                    var trumpsPlayed = [];
                    for (var i = 0; i < gameState.cardsPlayed.length; i++) {
                        if (gameState.cardsPlayed[i].suit == gameState.cardData.trump.suit)
                            trumpsPlayed.push(gameState.cardsPlayed[i]);
                    }

                    var bestCard;
                    if (trumpsPlayed.length > 0) {
                        bestCard = getHighestCard(trumpsPlayed);
                        print("Highest trump:", bestCard);
                    } else {
                        bestCard = getHighestCard(gameState.cardsPlayed);
                        print("Highest suit:", bestCard);
                    }

                    for (card of gameState.cardsPlayed) {
                        if (card == bestCard) {
                            //setTimeout(function() {
                            print("Player " + card.player + " has won this hand");
                            gameState.players[card.player].handsWon++;
                            gameState.winnerOfHand = card.player;
                        }
                    }
                }
            }
        }


        sendData("gameState", gameState);
        //print(gameState);
    }
}

function getHighestCard(cards) {
    var max = cards[0].number;
    var topCard = cards[0];
    print(cards[0].number);
    for (var i = 1; i < cards.length; i++) {
        print(cards[i].number);
        if (cards[i].number > max) {
            max = cards[i].number;
            topCard = cards[i];
        }
    }

    return topCard;
}