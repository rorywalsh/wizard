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
let cardsInHand = [];

function preload() {
    setupClient();
}

function setup() {
    game = new GameState();
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    console.log(windowWidth, windowHeight);
}

function draw() {
    // console.log("Drawing");
    background(255);

    if (playerDetails && game) {
        drawName();
        drawCards();
    }
}

function drawName() {
    fill(0);
    textSize(40);
    textAlign(LEFT);
    text("Name:" + playerDetails.name + ' Number of cards:' + game.getPlayer(playerDetails.id).currentCards.length,
        windowWidth * 0.05, windowHeight - windowHeight * .05);
}

function drawCards() {
    xPos = windowWidth * 0.01;
    for (card of cardsInHand) {
        card.display(
            (xPos += windowWidth * 0.05),
            windowHeight * 0.55,
            windowWidth * 0.125,
            windowHeight * 0.35
        );
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
            for (card of game.getPlayer(id).currentCards) {
                cardsInHand.push(new Card(card.suit, card.number));
                xPos += 110;
            }

            firstTimeConnection = false;
        }
    }
}



//handle mouse presses
function mousePressed() {
    handleScreenPress()
}

function touchStarted() {
    handleScreenPress();
}

function handleScreenPress() {
    for (card of cardsInHand) {
        if (card.hitTest() === true) {
            console.log('You just selected ' + card.suit + ' ' + card.number);
        }
    }
}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}