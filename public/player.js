//Player sketch - one instance per player

const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server
// const serverIp = 'https://rorywalsh-wizard.glitch.me';
// const serverPort = "3000";
// const local = false; // true if running locally, false

let firstTimeConnection = true;
let playerDetails;
let game;
let cardsInPlayersHand = [];
let deck;



function setup() {
    game = new GameState();
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    drawTopOfDeck();
    if (playerDetails && game) {
        drawName();
        drawCards();
    }
    if (deck) {
        deck.display(windowWidth * 0.06, windowHeight * 0.1, windowWidth * 0.125, windowHeight * 0.35);
    }
}

//display users name
function drawName() {
    fill(0);
    textSize(40);
    textAlign(LEFT);
    text("Name:" + playerDetails.name + ' Number of cards:' + game.getPlayer(playerDetails.id).currentCards.length,
        windowWidth * 0.05, windowHeight - windowHeight * .05);
}

//displays users cards
function drawCards() {
    xPos = windowWidth * 0.01;
    for (card of cardsInPlayersHand) {
        card.display(
            (xPos += windowWidth * 0.05),
            windowHeight * 0.55,
            windowWidth * 0.125,
            windowHeight * 0.35
        );
    }
}

function drawTopOfDeck(xPos, yPos, w, h) {
    for (let i = 0; i < w; i += 2) {
        strokeWeight(2);
        stroke(0);
        line(xPos * windowWidth + i, yPos * windowHeight, xPos * windowWidth + i + 10, xPos * windowWidth + h.windowHeight);
    }
}

//called each time host sends a message
function onReceiveData(incomingGameState) {
    if (incomingGameState.type == "gameState") {
        //reassign socket data as gameState class object
        game = Object.assign(new GameState(), incomingGameState);

        //if first time connection  - add player to local playerDetails object and create player's cards
        if (firstTimeConnection) {
            playerDetails = { id: game.getPlayer(id).id, number: game.getPlayer(id).number, name: game.getPlayer(id).name };

            let xPos = 0;
            let cardOverlap = windowWidth * .1;
            for (card of game.getPlayer(id).currentCards) {
                cardsInPlayersHand.push(new Card(card.suit, card.number, cardOverlap / 2));
                xPos += cardOverlap;
            }

            deck = new Card('Deck', -1, cardOverlap);


            firstTimeConnection = false;
        }
    }
}

//called when a user presses a particular card
function playCard(card) {
    //call some kind of method to determine tif this is a legal card..
    console.log('You just selected ' + card.suit + ' ' + card.number);
    cardsInPlayersHand.splice(cardsInPlayersHand.indexOf(card), 1);
}

//called when a user picks a card from the deck
function pickACardFromTheDeck() {
    //console.log('You just selected ' + card.suit + ' ' + card.number);
    let deck = game.getDeck();
    console.log(deck);
    let cardTurnedOver = random(deck.length);
    print(cardTurnedOver);
    console.log(deck[int(cardTurnedOver)]);
    //console.log("You just turned over " + cardTurnedOver.number + ' ' + cardTurnedOver.suit);
    //game.cards.splice(game.cards.indexOf(cardTurnedOver));

}

//called when a user picks a card from the deck
function pickACardFromTheHand(card) {
    console.log('You just selected ' + card.suit + ' ' + card.number);
}
//called when a user presses a particular card
function pickUpAllCards(card) {
    console.log('You just selected ' + card.suit + ' ' + card.number);
}
//called when a user presses a particular card
function dropACard(card) {
    console.log('You just selected ' + card.suit + ' ' + card.number);
}
//called whenever a user presses anywhere on screen..
function handleScreenPress() {
    //first check if this users turn to play card...
    if (game.playerUp === playerDetails.number) {
        for (card of cardsInPlayersHand) {
            if (card.shouldPlayCard() === true) {
                playCard(card);
            }
        }
        if (deck.shouldPlayCard()) {
            pickACardFromTheDeck();
        }
        //increment playerUp
        game.playerUp = game.playerUp < game.getNumberOfPlayers() - 1 ? game.playerUp + 1 : 0;
        sendData("gameState", game);

    } else {
        console.log("It's not your turn dopey!");
    }
}

//=======================================================================================================================
//handle mouse presses
function mousePressed() {
    handleScreenPress()
}

function touchStarted() {
    handleScreenPress();
}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}

function preload() {
    setupClient();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    console.log(windowWidth, windowHeight);
}