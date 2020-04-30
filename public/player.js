//Player sketch - one instance per player

const serverIp = "127.0.0.1";
const serverPort = "3000";
const local = true; // true if running locally, false
// if running on remote server
// const serverIp = 'https://rorywalsh-wizard.glitch.me';
// const serverPort = "3000";
// const local = false; // true if running locally, false

let firstTimeConnection = true;
let dealer; // local instance of game state object
let cardsInPlayersHand = []; // cards in player's hand - objects in this array both abstract and GUI information about card
let discardPile = []; // cards in discard pile - objects in this array both abstract and GUI information about card
let deckCard; // a dummy card that represents the top of the deck 
let playerInstructions = "";

//==============================================================
// drawing methods
//==============================================================
function setup() {
    dealer = new GameDealer();
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    if (dealer && dealer.getPlayer(id)) {
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
    text("Name:" + dealer.getPlayer(id).name + '-Number of cards:' + dealer.getPlayer(id).currentCards.length + "  ----------------  " + playerInstructions + '  ----------------  ',
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
function onReceiveData(incomingState) {
    if (incomingState.type == "gameState") {
        //reassign socket data as gameState class object
        dealer = Object.assign(new GameDealer(), incomingState);

        //do anything that needs doing just once here...
        if (firstTimeConnection) {
            firstTimeConnection = false;
            deckCard = new Card('Deck', -1);
        }

        //update cards each time the host send some data
        //recreating the cardsInPlayersHand[] was getting a little slow
        //so instead we just modify cardsInPlayersHand[] and make sure it's
        //up to date. 
        let xPos = 0;
        for (card of dealer.getPlayer(id).currentCards) {
            if (dealer.indexOfCardInCurrentCards(cardsInPlayersHand, card) == -1) {
                cardsInPlayersHand.push(new Card(card.suit, card.number));
            }
            xPos += windowWidth * .1;
        }

        discardPile = [];
        for (card of dealer.getDiscardPile()) {
            discardPile.push(new Card(card.suit, card.number));
        }

        playerInstructions = dealer.getInstructionsForPlayer(dealer.getPlayer(id));
        if (playerInstructions == '') {
            playerInstructions = (dealer.getPlayerUp() === dealer.getPlayer(id).number ? " You're up" : " It's not your turn...")
        }
    }
}

//==============================================================
// game events
//==============================================================
//called when a user presses a particular card
function playACard(card) {
    //if move is legal....
    if (dealer.playACardForPlayer(dealer.getPlayer(id), card).message != 'Illegal move') {
        //when card is played, remove it from current hand...
        cardsInPlayersHand.splice(dealer.indexOfCardInCurrentCards(cardsInPlayersHand, card), 1);
        sendData("gameState", dealer);
    }
}

//called when a user picks a card from the deck
function pickACardFromTheDeck() {
    dealer.dealCardFromDeckForPlayer(dealer.getPlayer(id));
    //update global game state
    sendData("gameState", dealer);
}

//called whenever a user presses anywhere on screen..
function handleScreenPress() {
    //first check if this users turn to play card...
    if (dealer.playerUp === dealer.getPlayer(id).number) {
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