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

function preload() {
    setupClient();
    noLoop();
}

function setup() {
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
    stroke(0);
 
    if (playerDetails)
        text(playerDetails.name, windowWidth * 0.05, windowHeight - windowHeight * .05);

}

//called each time host sends a message
function onReceiveData(incomingGameState) {
    if (incomingGameState.type == "gameState") {
        gameState = incomingGameState;


        numberOfPlayers = gameState.players.length;
        if (firstTimeConnection) {
            for (player of gameState.players) {
                if (player.id == id) {
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