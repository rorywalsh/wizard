// Network Settings
// const serverIp      = 'https://yourservername.herokuapp.com';
// const serverIp      = 'https://yourprojectname.glitch.me';
const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server

let playerDetails;
let currentCards = [];
let cardsPlayed = [];
let plusButton, minusButton, bidButton;
let bidValue = 0;
let cardsInRound = 0;
let displayBiddingText = false;
let displayYourTurnText = false;
let numberOfPlayers = 0;
let gameState;
let firstTimeConnection = true;
let infoMessage = '';

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

    //fill(255);
    //textSize(20);
    //text(id, 40, 40);

    for (card of currentCards) {
        card.display();
    }
    for (card of cardsPlayed) {
        card.display();
    }

    if (plusButton) plusButton.display();
    if (minusButton) minusButton.display();
    if (bidButton) bidButton.display();

    if (infoMessage.length > 0)
        drawMessageText(600, 650, infoMessage);

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

////////////////////////////////////////
// onReceiveData
// NOTE TO SELF: This is triggered for every instance of this script when the host outputs something....
////////////////////////////////////////
function onReceiveData(incomingGameState) {
    // Input data processing here. --->
    //console.log(incomingGameState);
    if (incomingGameState.type == "handFinished") {
        infoMessage = "Player " + incomingGameState.winner + " won that hand";
        setTimeout(function() {
            infoMessage = '';
            sendData("gameState", gameState);
        }, 4000);
    }

    if (incomingGameState.type == "gameState") {
        gameState = incomingGameState;

        numberOfPlayers = gameState.players.length;
        if (firstTimeConnection) {
            for (player of gameState.players) {
                if (player.id == id) {
                    playerDetails = { id: id, number: player.number };
                    //print("PlayerDetails:", playerDetails);
                }
            }
            firstTimeConnection = false;
        }

        if (playerDetails.number == gameState.currentBidder && gameState.state == 'bidding') {
            infoMessage = "Please bid";
        }

        if (playerDetails.number == gameState.playerToPlay && gameState.state == 'playing') {
            infoMessage = 'Please select a card';
        }

        var xPos = 100;

        if (gameState.cardData) {
            currentCards = [];
            playedCards = [];
            //print(data.deck.hands);
            for (var i = 0; i <= gameState.cardData.hands.length + 1; i++) {
                for (player of gameState.cardData.hands) {
                    if (playerDetails.number == i) {
                        for (card of player[i]) {
                            cardsInRound++;
                            // print(card);
                            currentCards.push(
                                new Card(
                                    xPos + 300,
                                    700,
                                    100,
                                    200,
                                    card.suit,
                                    card.number,
                                    '',
                                    card.shouldDisplay
                                )
                            );
                            xPos += 110;
                        }
                    }
                }
            }


            print('currentCards', currentCards);

            plusButton = new Button(400, 400, 100, 100, "+", gameState.cardData.trump.suit);
            minusButton = new Button(500, 400, 100, 100, "-", gameState.cardData.trump.suit);
            bidButton = new Button(
                400,
                500,
                200,
                100,
                "Bid:0",
                gameState.cardData.trump.suit
            );
            currentCards.push(
                new Card(120, 400, 200, 400, gameState.cardData.trump.suit, "Trump")
            );
        }

        if (gameState.cardsPlayed) {
            var xPos = 0;
            for (cardPlayed of gameState.cardsPlayed) {
                cardsPlayed.push(new Card(10 + xPos * 110, 50, 100, 200, cardPlayed.suit, cardPlayed.number, "[P " + cardPlayed.player + "]"));
                xPos++;
            }
        }

    }
}


/////////////////////
// mousePressed
/////////////////////
function mousePressed() {
    var tempCard, wasHit = false;
    if (playerDetails.number == gameState.playerToPlay && gameState.state == 'playing') {
        for (card of currentCards) {
            if (card.hitTest()) {
                wasHit = true;
                for (player of gameState.players) {
                    if (player.id == id) {
                        player.currentCard = card;
                        tempCard = card;
                    }
                }

            }
        }

        if (wasHit) {
            // print("The following cards were played in this hand");
            //for (card of gameState.cardsPlayed) {
            // print(card);
            //}

            var noTrump = true;
            if (gameState.cardsPlayed.length) {
                for (card of currentCards) {
                    print(card.suit, gameState.cardsPlayed[0].suit);
                    if (card.suit == gameState.cardsPlayed[0].suit) {
                        noTrump = false;
                        print("found a trump");
                    }
                }
            }

            if (gameState.cardsPlayed.length == 0 || gameState.cardsPlayed[0].suit == tempCard.suit || tempCard.number == 'w' || noTrump) {
                gameState.cardsPlayed.push({ player: playerDetails.number, suit: tempCard.suit, number: tempCard.number });
                infoMessage = '';
                gameState.cardsPlayedInCurrentHand++;
                print(gameState.cardData.hands[0]);

                for (var i = 0; i <= gameState.cardData.hands.length + 1; i++) {
                    for (player of gameState.cardData.hands) {
                        if (playerDetails.number == i) {
                            for (card of player[i]) {
                                print("Card:", card);
                                if (card.number == tempCard.number) {
                                    card.shouldDisplay = false;
                                    i = gameState.cardData.hands.length + 10;
                                }
                                print("Card:", card);
                            }
                        }
                    }
                }

                sendData("gameState", gameState);
            } else
                infoMessage = 'You must follow suit..';
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
            infoMessage = '';
            for (player of gameState.players) {
                if (player.id == id) {
                    player.bid = bidValue;
                }
            }
            // print(gameState);

            sendData("gameState", gameState);
        }
    }
}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}