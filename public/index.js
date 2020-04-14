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
let leaderBoard = null;
let infoMessage = "";
let nameField;
let submitButton;
let infoDisplay;

function preload() {
    setupClient();
    noLoop();
    //setInterval(draw, 0.1);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log(windowWidth, windowHeight);
    textFont("Courier New Bold");
    infoDisplay = new InfoDisplay("", color(40, 40, 40), color(0), color(255));
    loop();
    plusButton = new Button("plusButton", "+", color(0, 200, 0), color(40, 40, 40), color(0, 0, 0), color(0, 155, 0));
    minusButton = new Button("minusButton", "-", color(0, 200, 0), color(40, 40, 40), color(0, 0, 0), color(0, 155, 0));
    bidButton = new Button("bidButton", "Bid:0", color(255, 0, 0), color(40, 40, 40), color(0, 0, 0), color(255, 100, 0));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    console.log(windowWidth, windowHeight);
}

function draw() {
    // console.log("Drawing");
    background(255);
    fill(0);
    stroke(0);
    strokeWeight(1);
    var yPos = 0,
        xPos = 0;

    if (playerDetails)
        text("Player " + playerDetails.number, windowWidth * 0.05, windowHeight - windowHeight * .05);

    for (card of currentCards) {
        card.display(
            (xPos += windowWidth * 0.05),
            windowHeight * 0.55,
            windowWidth * 0.125,
            windowHeight * 0.35
        );
    }

    xPos = windowWidth * 0.15;
    for (card of cardsPlayed) {
        card.display(
            (xPos += windowWidth * 0.05),
            windowHeight * 0.05,
            windowWidth * 0.125,
            windowHeight * 0.35
        );
    }

    if (trumpCard) {
        trumpCard.display(
            windowWidth * 0.05,
            windowHeight * 0.05,
            windowWidth * 0.125,
            windowHeight * 0.35
        );

        plusButton.display(
            windowWidth * 0.775,
            windowHeight * 0.8,
            windowWidth * 0.05
        );

        minusButton.display(
            windowWidth * 0.925,
            windowHeight * 0.8,
            windowWidth * 0.05
        );

        bidButton.display(
            windowWidth * 0.85,
            windowHeight * 0.65,
            windowWidth * 0.1
        );
    }

    if (bidButton) {
        if (infoDisplay.text.length > 0) {
            if (infoDisplay.text.includes('Please bid')) {
                bidButton.focus = true;
                plusButton.focus = true;
                minusButton.focus = true;
            } else {
                bidButton.focus = false;
                plusButton.focus = false;
                minusButton.focus = false;
                bidButton.text = 'Done';
            }
        }
    }

    if (gameState) {
        leaderBoard.display(
            windowWidth * 0.55,
            windowHeight * 0.1,
            windowWidth * 0.4,
            windowHeight * 0.25
        );

    }

    if (infoDisplay.text != '')
        infoDisplay.display(windowWidth * .3, windowHeight * .45, windowWidth * .4, windowHeight * .08);
    if (isClientConnected((display = true))) {}
}

function drawMessageText(x, y, message) {
    fill(255);
    textSize(52);
    textAlign(CENTER);
    text(message, x, y);
}



function createNameInputField() {
    nameField = createInput('Player ' + playerDetails.number + ': Click to change name');
    nameField.style('font-size', '21px');
    nameField.position(windowWidth * .74, windowHeight * .9);
    nameField.size(windowWidth * .15, windowHeight * .05);
    nameField.mousePressed(nameFieldPressed);
    submitButton = createButton('Submit');
    submitButton.style('font-size', '24px');
    submitButton.position(windowWidth * .9, windowHeight * .9);
    submitButton.size(windowWidth * .05, windowHeight * .055);
    submitButton.mousePressed(submitButtonPressed);
}

function submitButtonPressed() {
    for (player of gameState.players) {
        if (player.id == playerDetails.id) {
            player.name = nameField.value();
        }
    }
    sendData("gameState", gameState);
}

function nameFieldPressed() {
    nameField.value('');
}

////////////////////////////////////////
// onReceiveData
////////////////////////////////////////
function onReceiveData(incomingGameState) {
    if (incomingGameState.type == "gameState") {
        gameState = incomingGameState;
        if (leaderBoard)
            leaderBoard.players = gameState.players;


        if (gameState.winnerOfHand != -1 && gameState.state == 'playing') {
            var winner = gameState.winnerOfHand;
            infoDisplay.text = "Player " + gameState.winnerOfHand + " won the hand";

            gameState.playerToPlay = winner;
            console.log("Incrementing tricks");
            gameState.tricksPlayed++;
            gameState.state = 'summary';
            console.log("Hand won:TricksPlayed", gameState.tricksPlayed);
            console.log("Hand won:Round number", gameState.round);

            if (gameState.winnerOfHand == playerDetails.number) {
                if (gameState.tricksPlayed == gameState.round) {
                    setTimeout(function() {
                        console.log("Starting next round");
                        playNextRound();
                        sendData("gameState", gameState);
                    }, 3000);
                } else {
                    setTimeout(function() {
                        console.log("Starting next hand");
                        gameState.cardsPlayedInCurrentHand = 0;
                        gameState.cardsPlayed = [];
                        gameState.state = 'playing';
                        sendData("gameState", gameState);
                    }, 3000);
                }
            }
            gameState.winnerOfHand = -1;
            // 
        } else {
            // console.log("TricksPlayed", gameState.tricksPlayed);
            // console.log("Round number", gameState.round);
        }

        numberOfPlayers = gameState.players.length;
        if (firstTimeConnection) {
            for (player of gameState.players) {
                if (player.id == id) {
                    playerDetails = { id: id, number: player.number, name: '' };
                }
            }
            firstTimeConnection = false;
        }

        // console.log("Player to play: ", gameState.playerToPlay);
        // console.log("Player number: ", playerDetails.number);
        if (gameState.state == "bidding") {
            if (playerDetails.number == gameState.currentBidder) {
                infoDisplay.text = "Please bid.";
                bidButton.text = 'Bid:0';
            } else {
                infoDisplay.text = "Please wait.";
            }
        } else if (gameState.state == "playing") {
            console.log("status:playing");
            if (playerDetails.number == gameState.playerToPlay) {
                infoDisplay.text = "Please select a card.";
            } else {
                infoDisplay.text = "Please wait.";
            }
        }

        var xPos = 100;

        if (gameState.cardData) {
            currentCards = [];
            playedCards = [];
            //console.log(data.deck.hands);
            for (var i = 0; i <= gameState.cardData.hands.length + 1; i++) {
                for (player of gameState.cardData.hands) {
                    if (playerDetails.number == i) {
                        for (card of player[i]) {
                            cardsInRound++;
                            // console.log(card);
                            if (card.shouldDisplay)
                                currentCards.push(
                                    new Card(
                                        xPos + 300,
                                        700,
                                        100,
                                        200,
                                        card.suit,
                                        card.number,
                                        "",
                                        card.shouldDisplay
                                    )
                                );
                            xPos += 110;
                        }
                    }
                }
            }

            //console.log('currentCards', currentCards);
            if (!leaderBoard)
                leaderBoard = new LeaderBoard(gameState.players);

            if (!nameField) {
                createNameInputField();
            }

            trumpCard = new Card(
                0,
                0,
                0,
                0,
                gameState.cardData.trump.suit,
                "Trump"
            );
        }

        if (gameState.cardsPlayed) {
            cardsPlayed = [];
            var xPos = 0;
            for (cardPlayed of gameState.cardsPlayed) {
                cardsPlayed.push(
                    new Card(
                        10 + xPos * 110,
                        50,
                        100,
                        200,
                        cardPlayed.suit,
                        cardPlayed.number,
                        "[P " + cardPlayed.player + "]"
                    )
                );
                xPos++;
            }
        }
    }
}

function playNextRound() {
    var currentDealer = gameState.dealer;
    gameState.cardsPlayedInCurrentHand = 0;
    gameState.cardsPlayed = [];
    gameState.currentBidder =
        currentDealer + 1 > gameState.players.length - 1 ?
        0 :
        currentDealer + 1;

    gameState.round++;
    console.log("playNextRound");

    for (player of gameState.players) {
        if (player.bid == player.handsWon)
            player.score += 20 + player.handsWon * 10;
        else
            player.score =
            player.score - abs(player.bid - player.handsWon) * 10;
    }

    for (player of gameState.players) {
        player.handsWon = 0;
    }

    gameState.tricksPlayed = 0;
    gameState.state = "bidding";
    gameState.numberOfBids = 0;
    gameState.handsPlayed = 0;
    gameState.dealer =
        currentDealer < gameState.players.length ? currentDealer + 1 : 0;
    var currentBidder = gameState.currentBidder;
    gameState.playerToPlay = currentBidder;
    console.log("Player to start next round is", gameState.playerToPlay);
    gameState.cardsPlayedInCurrentHand = 0;
    var hands = new Cards();
    hands.deal(gameState.round, gameState.players.length);
    gameState.cardData = hands;
    // console.log("===== GAME STATE ===========");
    console.log(gameState);
}
/////////////////////
// mousePressed
/////////////////////
function mousePressed() {
    var tempCard,
        wasHit = false;
    if (playerDetails.number == gameState.playerToPlay &&
        gameState.state == "playing") {
        for (card of currentCards) {
            if (card.hitTest()) {
                wasHit = true;
                for (player of gameState.players) {
                    if (player.id == id) {
                        player.currentCard = card;
                        tempCard = card;
                        console.log(tempCard);
                    }
                }
            }
        }

        if (wasHit) {
            var noSuitedCard = true;
            if (gameState.cardsPlayed.length) {
                for (card of currentCards) {
                    // console.log(card.suit, gameState.cardsPlayed[0].suit);
                    if (
                        card.suit == gameState.cardsPlayed[0].suit &&
                        card.shouldDisplay
                    ) {
                        noSuitedCard = false;
                    }
                }
            }

            if (gameState.cardsPlayed.length == 0 ||
                gameState.cardsPlayed[0].suit == tempCard.suit ||
                tempCard.number == "W" ||
                tempCard.number == 0 ||
                noSuitedCard) {
                gameState.cardsPlayed.push({
                    player: playerDetails.number,
                    suit: tempCard.suit,
                    number: tempCard.number,
                });
                //cardsPlayed.push(new Card(10 + xPos * 110, 50, 100, 200, cardPlayed.suit, cardPlayed.number, "[P " + cardPlayed.player + "]"));
                infoMessage = "";
                gameState.cardsPlayedInCurrentHand++;
                // console.log(gameState.cardData.hands[0]);

                for (var i = 0; i <= gameState.cardData.hands.length + 1; i++) {
                    for (player of gameState.cardData.hands) {
                        if (playerDetails.number == i) {
                            for (card of player[i]) {
                                if (
                                    card.number == tempCard.number &&
                                    card.suit == tempCard.suit
                                ) {
                                    card.shouldDisplay = false;
                                    i = gameState.cardData.hands.length + 10;
                                }
                            }
                        }
                    }
                }
                console.log("Just incrememted player to play");
                gameState.playerToPlay =
                    gameState.playerToPlay == gameState.players.length - 1 ?
                    0 :
                    gameState.playerToPlay + 1;
                sendData("gameState", gameState);
            } else
                infoDisplay.text = "You must follow suit..";
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
            infoMessage = "";
            for (player of gameState.players) {
                if (player.id == id) {
                    player.bid = bidValue;
                    gameState.numberOfBids++;
                    gameState.currentBidder =
                        gameState.currentBidder == gameState.players.length - 1 ?
                        0 :
                        gameState.currentBidder + 1;
                }
            }
            // console.log(gameState);

            sendData("gameState", gameState);
        }
    }

    //sendData("gameState", gameState);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}