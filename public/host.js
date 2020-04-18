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
let numberOfPlayers = 2;
let numberOfCards = 13;
let createLink;
let linkCreated = false;
let gameState;

function preload() {
    setupHost();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    plusPlayers = new Button("plusButton", "+", color(200, 0, 200), color(60, 60, 60), color(0, 0, 0), color(0, 155, 0));
    minusPlayers = new Button("minusButton", "-", color(200, 0, 200), color(60, 60, 60), color(0, 0, 0), color(0, 155, 0));
    plusCards = new Button("plusButton", "+", color(200, 0, 200), color(60, 60, 60), color(0, 0, 0), color(0, 155, 0));
    minusCards = new Button("minusButton", "-", color(200, 0, 200), color(60, 60, 60), color(0, 0, 0), color(0, 155, 0));

    gameState = {
        players: [],
        currentCards: [],
        score: 0,
        cardData: null,
        dealer: 0,
        round: 1,
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
    background(255);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(windowWidth * .025);
    strokeWeight(windowHeight * .01);
    stroke(80, 80, 80);
    fill(0, 200, 0);
    rect(windowWidth * .33, windowHeight * .1, windowWidth * .33, windowHeight * .1, windowHeight * .01)
    fill(255);
    stroke(60);
    text("Welcome to Wizard!", windowWidth * .33, windowHeight * .1, windowWidth * .33, windowHeight * .1);
    strokeWeight(0);
    fill(0);
    textSize(windowWidth * .015);
    text("The page should only be loaded by the game coordinator. All subsequent players should navigate to the link shown below.", windowWidth * .33, windowHeight * .25, windowWidth * .33, windowHeight * .15);

    textSize(windowWidth * .018);
    strokeWeight(windowHeight * .01);
    stroke(80, 80, 80);
    fill(0, 200, 0);
    rect(windowWidth * .32, windowHeight * .452, windowWidth * .35, windowHeight * .09, windowHeight * .01)
    stroke(60);
    fill(255);
    text("Number of players: " + numberOfPlayers.toString(), windowWidth * .33, windowHeight * .45, windowWidth * .35, windowHeight * .1);
    plusPlayers.display(
        windowWidth * 0.37,
        windowHeight * 0.5,
        windowWidth * 0.05
    );

    minusPlayers.display(
        windowWidth * 0.625,
        windowHeight * 0.5,
        windowWidth * 0.05
    );

    textSize(windowWidth * .018);
    strokeWeight(windowHeight * .01);
    stroke(80, 80, 80);
    fill(0, 200, 0);
    rect(windowWidth * .32, windowHeight * .6, windowWidth * .35, windowHeight * .09, windowHeight * .01)
    stroke(60);
    fill(255);
    text("Number of cards: " + numberOfCards.toString(), windowWidth * .33, windowHeight * .6, windowWidth * .35, windowHeight * .1);
    plusCards.display(
        windowWidth * 0.37,
        windowHeight * 0.645,
        windowWidth * 0.05
    );

    minusCards.display(
        windowWidth * 0.625,
        windowHeight * 0.645,
        windowWidth * 0.05
    );

    strokeWeight(windowHeight * .005);
    stroke(80, 80, 80);
    fill(200, 0, 200);
    rect(windowWidth * .2, windowHeight * .75, windowWidth * .6, windowHeight * .08, windowHeight * .01)
    fill(255);
    text("Game Link:  " + serverIp + "/?=" + roomId, windowWidth * .2, windowHeight * .75, windowWidth * .6, windowHeight * .09);

    strokeWeight(windowHeight * .005);
    stroke(80, 80, 80);
    fill(0, 200, 0);
    rect(windowWidth * .32, windowHeight * .86, windowWidth * .35, windowHeight * .06, windowHeight * .008)
    fill(255);
    if (gameState.players.length > 0) {
        text("Game Status: " +
            (gameState.players.length == numberOfPlayers ?
                "In Progress" :
                "Initiliasing"), windowWidth * .32, windowHeight * .85, windowWidth * .35, windowHeight * .09);
    } else {
        text("Game Status: Unknown", windowWidth * .32, windowHeight * .85, windowWidth * .35, windowHeight * .09);
    }

    if (isHostConnected((display = true))) {}
}

function startNewRound() {
    hands = new Cards();
    hands.deal(gameState.round + 7, gameState.players.length);
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
        name: 'Player ' + gameState.players.length,
        currentCard: { suit: '', value: -1 }
    });

    // once all players have logged on, start new round...
    if (gameState.players.length == numberOfPlayers) {
        setTimeout(function() {
            startNewRound();
        }, 1000)

    }
}

function handleScreenPress() {
    if (plusPlayers.hitTest() == true) {
        numberOfPlayers++;
    }

    if (minusPlayers.hitTest() == true) {
        numberOfPlayers = numberOfPlayers > 0 ? numberOfPlayers - 1 : 0;
    }

    if (plusCards.hitTest() == true) {
        numberOfCards = numberOfCards < 13 ? numberOfCards + 1 : 13;
    }

    if (minusCards.hitTest() == true) {
        numberOfCards = numberOfCards > 0 ? numberOfCards - 1 : 0;
    }
}

function mousePressed() {
    handleScreenPress();
}

function touchStarted() {
    handleScreenPress();
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
                    if (card.number == 'W') {
                        print(gameState.players[card.player].name + " won this hand");
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