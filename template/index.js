/*
p5.multiplayer - CLIENT

This 'client' sketch is intended to be run in either mobile or 
desktop browsers. It sends a basic joystick and button input data 
to a node server via socket.io. This data is then rerouted to a 
'host' sketch, which displays all connected 'clients'.

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

let playerDetails;
let currentCards = [];
let plusButton, minusButton, bidButton;
let bidValue = 0;
let cardsInRound = 0;
let displayBiddingText = false;
let displayYourTurnText = false;
let numberOfPlayers = 0;
let gameState;
let firstTimeConnection = true;

function preload() {
    setupClient();
    noLoop();
    setInterval(draw, 0.1);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // print("Drawing");
    background(0);

    fill(255);
    textSize(20);
    text(id, 40, 40);

    for (card of currentCards) {
        card.display();
    }

    if (plusButton) plusButton.display();
    if (minusButton) minusButton.display();
    if (bidButton) bidButton.display();

    if (displayBiddingText)
        drawMessageText(600, 650, "Please make a bid..");

    if (displayYourTurnText)
        drawMessageText(700, 650, "Please select a card to play.");




    if (gameState) {
        fill(255);
        textSize(52);
        textAlign(CENTER);
        for (var i = 0; i < gameState.players.length; i++) {
            text(
                "[Player " + gameState.players[i].number + "] [Bid:" + (gameState.players[i].bid > -1 ? gameState.players[i].bid : '-') + "] [Hands Won:" + gameState.players[i].handsWon + "] [Score:" + gameState.players[i].score + ']',
                1300,
                400 + 60 * i
            );
        }
    }

    if (isClientConnected((display = true))) {}
}

function drawMessageText(x, y, message) {
    fill(255);
    textSize(52);
    textAlign(CENTER);
    text(message, x, y);
}

// Messages can be sent from a host to all connected clients
function onReceiveData(incomingGameState) {
    // Input data processing here. --->
    console.log(incomingGameState);

    if (incomingGameState.type == "gameState") {
        gameState = incomingGameState;

        numberOfPlayers = incomingGameState.players.length;
        if (firstTimeConnection) {
            for (player of incomingGameState.players) {
                if (player.id == id) {
                    playerDetails = { id: id, number: player.number };
                    print("PlayerDetails:", playerDetails);
                }
            }
            firstTimeConnection = false;
        }

        if (playerDetails.number == incomingGameState.currentBidder && incomingGameState.state == 'bidding') {
            displayBiddingText = true;
        }

        if (playerDetails.number == incomingGameState.playerToPlay && incomingGameState.state == 'playing') {
            displayYourTurnText = true;
        }

        var xPos = 100;

        if (incomingGameState.cardData) {
            print("numberOfHands:", incomingGameState.cardData.hands.length + 1);
            //print(data.deck.hands);
            for (var i = 0; i <= incomingGameState.cardData.hands.length + 1; i++) {
                for (player of incomingGameState.cardData.hands) {
                    if (playerDetails.number == i) {
                        for (card of player[i]) {
                            cardsInRound++;
                            print(card);
                            currentCards.push(
                                new Card(
                                    xPos + 300,
                                    700,
                                    100,
                                    200,
                                    card.suit,
                                    card.number
                                )
                            );
                            xPos += 110;
                        }
                    }
                }
            }

            plusButton = new Button(400, 400, 100, 100, "+", incomingGameState.cardData.trump.suit);
            minusButton = new Button(500, 400, 100, 100, "-", incomingGameState.cardData.trump.suit);
            bidButton = new Button(
                400,
                500,
                200,
                100,
                "Bid:0",
                incomingGameState.cardData.trump.suit
            );
            currentCards.push(
                new Card(120, 400, 200, 400, incomingGameState.cardData.trump.suit, "Trump")
            );
        }
    }
}

function mousePressed() {
    if (playerDetails.number == gameState.playerToPlay && gameState.state == 'playing') {
        var cardTmp, wasHit = false;
        for (card of currentCards) {
            if (card.hitTest()) {
                wasHit = true;
                for (player of gameState.players) {
                    print(player.id, id);
                    if (player.id == id) {
                        player.currentCard = card;
                        cardTmp = card;
                        sendData("gameState", gameState);
                    }
                }

            }
        }

        if (wasHit) {
            gameState.cardsPlayedInCurrentHand++;
            currentCards.push(new Card(10 + gameState.cardsPlayedInCurrentHand * 110, 50, 100, 200, cardTmp.suit, cardTmp.number));
            gameState.cardsPlayed.push({ player: playerDetails.number, tmpCard });
            displayYourTurnText = false;
        }

    }

    if (plusButton.hitTest() == true) {
        bidValue = bidValue < cardsInRound ? bidValue + 1 : cardsInRound;
        bidButton.text = "Bid:" + bidValue.toString();
    }
    if (minusButton.hitTest() == true) {
        bidValue = bidValue > 0 ? bidValue - 1 : 0;
        bidButton.text = "Bid:" + bidValue.toString();
    }
    if (playerDetails.number == gameState.currentBidder) {
        if (bidButton.hitTest() == true) {
            displayBiddingText = false;
            for (player of gameState.players) {
                if (player.id == id) {
                    player.bid = bidValue;
                }
            }
            print(gameState);

            sendData("gameState", gameState);
        }
    }
}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}