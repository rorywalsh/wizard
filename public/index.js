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

let firstTimeConnection = true;
let playerDetails;
let game;

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
    fill(0);
    textSize(40);
    if (playerDetails && game)
        text("Name:" + playerDetails.name + ' Number of cards:' + game.getPlayerFromId(playerDetails.id).currentCards.length, 
            windowWidth * 0.05, windowHeight -  windowHeight * .1);

}

//called each time host sends a message
function onReceiveData(incomingGameState) {
    if (incomingGameState.type == "gameState") {
        //reassign socket data as gameState clas object
        game = Object.assign(new GameState(), incomingGameState);

        //if first time connection add player to local playerDetails object
        if (firstTimeConnection) {
            for (player of game.players) {
                print(player);
                if (player.id == id) {
                    print("Found a player");
                    playerDetails = { id: id, number: player.number, name: player.name };
                }
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

}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}