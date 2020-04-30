//Player sketch - one instance per player

const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server
// const serverIp = 'https://rorywalsh-wizard.glitch.me';
// const serverPort = "3000";
// const local = false; // true if running locally, false

let firstTimeConnection = true;
let playerDetails; // hold details about plays such as  unique id, player index, and player name
let game; // local instance of game state object
let cardsInPlayersHand = []; // cards in player's hand - objects in this array both abstract and GUI information about card
let discardPile = []; // cards in discard pile - objects in this array both abstract and GUI information about card
let deckCard; // a dummy card that represents the top of the deck 
let playerInstructions = "";

//==============================================================
// drawing methods
//==============================================================
function setup() {
    game = new GameState();
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    if (playerDetails && game) {
        displayInfo();
        displayCards();
    }

    if (discardPile) {
        displayDiscardPile();
    }

    if (deckCard) {
        deckCard.display(windowWidth * 0.06, windowHeight * 0.1, windowWidth * 0.125, windowHeight * 0.35);
    }
}

//display users name
function displayInfo() {
    fill(0);
    textSize(40);
    textAlign(LEFT);
    text("Name:" + playerDetails.name + '-Number of cards:' + game.getPlayer(playerDetails.id).currentCards.length + "  ----------------  " + playerInstructions + '  ----------------  ',
        windowWidth * 0.05, windowHeight - windowHeight * .05);
}

//displays users cards
function displayCards() {
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

//displays discard pile
function displayDiscardPile() {
    xPos = windowWidth * 0.2;
    for (card of discardPile) {
        card.display(
            (xPos += windowWidth * 0.01),
            windowHeight * 0.1,
            windowWidth * 0.125,
            windowHeight * 0.35
        );
    }
}

//==============================================================
// called whenever the host sends data to players...
//==============================================================
function onReceiveData(incomingGameState) {
    if (incomingGameState.type == "gameState") {
        //reassign socket data as gameState class object
        game = Object.assign(new GameState(), incomingGameState);

        //if first time connection  - add player to local playerDetails object and create player's cards
        if (firstTimeConnection) {
            playerDetails = { id: game.getPlayer(id).id, number: game.getPlayer(id).number, name: game.getPlayer(id).name };
            firstTimeConnection = false;
            deckCard = new Card('Deck', -1);
        }

        //update cards each time the host send some data
        //recreating the cardsInPlayersHand[] was getting a little slow
        //so instead we just modify cardsInPlayersHand[] and make sure it's
        //up to date. 
        let xPos = 0;
        for (card of game.getPlayer(id).currentCards) {
            if (game.indexOfCardInCurrentCards(cardsInPlayersHand, card) == -1) {
                cardsInPlayersHand.push(new Card(card.suit, card.number));
            }
            xPos += windowWidth * .1;
        }

        discardPile = [];
        for (card of game.getDiscardPile()) {
            discardPile.push(new Card(card.suit, card.number));
        }

        playerInstructions = game.getInstructionsForPlayer(game.getPlayer(id));
        if (playerInstructions == '') {
            playerInstructions = (game.getPlayerUp() === game.getPlayer(playerDetails.id).number ? " You're up" : " It's not your turn...")
        }
    }
}

//==============================================================
// game events
//==============================================================
//called when a user presses a particular card
function playACard(card) {
    //if move is legal....
    if (game.playCard(game.getPlayer(id), card).message != 'Illegal move') {
        //when card is played, remove it from current hand...
        cardsInPlayersHand.splice(game.indexOfCardInCurrentCards(cardsInPlayersHand, card), 1);
        sendData("gameState", game);
    }
}

//called when a user picks a card from the deck
function pickACardFromTheDeck() {
    game.pickCardFromDeck(game.getPlayer(id));
    //update global game state
    sendData("gameState", game);
}

//called when a user picks a card from the deck
function pickACardFromTheHand(card) {
    console.log('You just selected ' + card.suit + ' ' + card.number);
}

//called whenever a user presses anywhere on screen..
function handleScreenPress() {
    //first check if this users turn to play card...
    if (game.playerUp === playerDetails.number) {
        for (card of cardsInPlayersHand) {
            //make sure we use the full width of the top most card when testing hits....
            const hitTestWidth = cardsInPlayersHand.indexOf(card) == cardsInPlayersHand.length - 1 ? 1 : 0.3;
            if (card.shouldPlayCard(hitTestWidth) === true) {
                playACard(card);
            }
        }
        if (deckCard.shouldPlayCard(1)) {
            pickACardFromTheDeck();
        }
        //increment playerUp


    } else {
        console.log("It's not your turn dopey!");
    }
}

//==============================================================
// wrapper / utility methods...
//==============================================================
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