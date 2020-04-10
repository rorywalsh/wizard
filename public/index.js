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
let trumpCard;
let plusButton, minusButton, bidButton;
let bidValue = 0;
let cardsInRound = 0;
let startNextRound = false;
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

    textAlign(LEFT);
    textSize(30);
    if (playerDetails)
        text("Player " + playerDetails.number, 140, 900);

    for (card of currentCards) {
        card.display();
    }
    for (card of cardsPlayed) {
        card.display();
    }

    if (trumpCard) trumpCard.display();
    if (plusButton) plusButton.display();
    if (minusButton) minusButton.display();
    if (bidButton) bidButton.display();

    if (infoMessage.length > 0)
        drawMessageText(600, 650, infoMessage);

    if (gameState) {
        fill(255);
        textSize(52);
        textAlign(CENTER);
        for (var i = 0; i < gameState.players.length; i++) {
            text(
                "[Player " + gameState.players[i].number + "] [Bid:" + (gameState.players[i].bid > -1 ? gameState.players[i].bid : '-') + "] [Hands Won:" + gameState.players[i].handsWon + "] [Score:" + gameState.players[i].score,
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

    if (incomingGameState.type == "gameState") {
        // print(gameState);
        gameState = incomingGameState;

        if (gameState.winnerOfHand != -1) {
            var winner = gameState.winnerOfHand;
            infoMessage = "Player " + gameState.winnerOfHand + " won that hand";
            gameState.winnerOfHand = -1;
            gameState.playerToPlay = winner;
            print("Incrementing tricks");
            gameState.tricksPlayed++;
            gameState.cardsPlayedInCurrentHand = 0;
            gameState.cardsPlayed = [];
            // infoMessage = "";
            print("Hand won:TricksPlayed", gameState.tricksPlayed);
            print("Hand won:Round number", gameState.round);
            if (gameState.tricksPlayed == gameState.round)
                playNextRound();

            sendData("gameState", gameState);

            // setTimeout(function() {
            //     infoMessage = '';
            // }, 3000);

        } else {
            print("TricksPlayed", gameState.tricksPlayed);
            print("Round number", gameState.round);
        }

        numberOfPlayers = gameState.players.length;
        if (firstTimeConnection) {
            for (player of gameState.players) {
                if (player.id == id) {
                    playerDetails = { id: id, number: player.number };
                }
            }
            firstTimeConnection = false;
        }

        // print("Player to play: ", gameState.playerToPlay);
        // print("Player number: ", playerDetails.number);

        if (playerDetails.number == gameState.currentBidder && gameState.state == 'bidding') {
            infoMessage = "Please bid";
            bidValue = 0;
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


            //print('currentCards', currentCards);

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

            trumpCard = new Card(120, 400, 200, 400, gameState.cardData.trump.suit, "Trump");

        }

        if (gameState.cardsPlayed) {
            cardsPlayed = [];
            var xPos = 0;
            for (cardPlayed of gameState.cardsPlayed) {
                cardsPlayed.push(new Card(10 + xPos * 110, 50, 100, 200, cardPlayed.suit, cardPlayed.number, "[P " + cardPlayed.player + "]"));
                xPos++;
            }
        }

        // //check for round over
        // var roundOver = false;
        // for (var i = 0; i <= gameState.cardData.hands.length; i++) {
        //     for (player of gameState.cardData.hands) {
        //         for (card of player[i]) {
        //             //print(playerDetails.number, card);
        //             if (card.shouldDisplay == true) {
        //                 roundOver = false;
        //                 i = 10000;
        //             }
        //         }
        //     }
        // }

    }
}

function playNextRound() {
    var currentDealer = gameState.dealer;
    gameState.currentBidder = (currentDealer + 1 > gameState.players.length - 1 ? 0 : currentDealer + 1);
    gameState.round++;

    for (player of gameState.players) {
        print("player:" + player.number + " bid:" + player.bid + " handsWon:" + player.handsWon);
        if (player.bid == player.handsWon)
            player.score += (20 + player.handsWon * 10);
        else
            player.score = player.score - (abs(player.bid - player.handsWon) * 10);
    }

    for (player of gameState.players) {
        player.handsWon = 0;
    }


    gameState.tricksPlayed = 0;
    gameState.state = 'bidding';
    gameState.numberOfBids = 0;
    gameState.handsPlayed = 0;
    gameState.dealer = (currentDealer < gameState.players.length ? currentDealer + 1 : 0);
    var currentBidder = gameState.currentBidder;
    gameState.playerToPlay = currentBidder;
    print("Player to start next round is", gameState.playerToPlay);
    gameState.cardsPlayedInCurrentHand = 0;
    var hands = new Cards();
    hands.deal(gameState.round, gameState.players.length);
    gameState.cardData = hands;
    print('===== GAME STATE ===========');
    print(gameState);
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
            var noSuitedCard = true;
            if (gameState.cardsPlayed.length) {
                for (card of currentCards) {
                    // print(card.suit, gameState.cardsPlayed[0].suit);
                    if (card.suit == gameState.cardsPlayed[0].suit && card.shouldDisplay) {
                        noSuitedCard = false;
                        // print("found a suit");
                    }
                }
            }

            if (gameState.cardsPlayed.length == 0 || gameState.cardsPlayed[0].suit == tempCard.suit || tempCard.number == 'w' || noSuitedCard) {
                gameState.cardsPlayed.push({ player: playerDetails.number, suit: tempCard.suit, number: tempCard.number });
                //cardsPlayed.push(new Card(10 + xPos * 110, 50, 100, 200, cardPlayed.suit, cardPlayed.number, "[P " + cardPlayed.player + "]"));
                infoMessage = '';
                gameState.cardsPlayedInCurrentHand++;
                // print(gameState.cardData.hands[0]);

                for (var i = 0; i <= gameState.cardData.hands.length + 1; i++) {
                    for (player of gameState.cardData.hands) {
                        if (playerDetails.number == i) {
                            for (card of player[i]) {
                                if (card.number == tempCard.number && card.suit == tempCard.suit) {
                                    card.shouldDisplay = false;
                                    i = gameState.cardData.hands.length + 10;
                                }
                            }
                        }
                    }
                }
                print("Just incrememted player to play");
                gameState.playerToPlay = (gameState.playerToPlay == gameState.players.length - 1 ? 0 : gameState.playerToPlay + 1);
                sendData("gameState", gameState);
            } else
                infoMessage = 'You must follow suit..';
        }
    }

    if (plusButton.hitTest() == true) {
        bidValue = bidValue < gameState.round ? bidValue + 1 : bidValue;
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
                    gameState.numberOfBids++;
                    gameState.currentBidder = (gameState.currentBidder == gameState.players.length - 1 ? 0 : gameState.currentBidder + 1);

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