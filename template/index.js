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
const serverIp = 'https://https://rorywalsh.github.io/'; //'127.0.0.1';
const serverPort = '3000';
const local = false; // true if running locally, false
// if running on remote server

let playerDetails;
let currentCards = [];
let plusButton, minusButton, bidButton;
let bidValue = 0;
let cardsInRound = 0;
let displayBiddingText = false;
let numberOfPlayers = 0;
let playerData;

function preload() {
    setupClient();
    noLoop();
    setInterval(draw, .1);
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

    if (plusButton)
        plusButton.display();
    if (minusButton)
        minusButton.display();
    if (bidButton)
        bidButton.display();

    if (displayBiddingText) {
        fill(255);
        textSize(52);
        textAlign(CENTER);
        text("Please make a bid", 600, 700);
    }

    if (playerData) {
        fill(255);
        textSize(52);
        textAlign(CENTER);
        for (var i = 0; i < playerData.length; i++) {
            text("Player" + playerData[i].number + " Bid:" + playerData[i].bid, 1000, 400 + 60 * i);
        }
    }


    if (isClientConnected(display = true)) {

    }
}

// Messages can be sent from a host to all connected clients
function onReceiveData(data) {
    // Input data processing here. --->
    console.log(data);

    if (data.type == 'playerData') {
        playerData = data.players;
        numberOfPlayers = data.players.length;
        for (player of data.players) {

            if (player.id == id) {
                playerDetails = { id: id, number: player.number };
                print(playerDetails);
            }
        }
    }

    if (data.type == 'bidding') {
        if (playerDetails.number == data.number) {
            displayBiddingText = true;
        }
    }
    if (data.type == 'cardData') {
        var xPos = 100;

        print("numberOfHands:", data.deck.hands.length + 1);
        //print(data.deck.hands);
        for (var i = 0; i <= data.deck.hands.length + 1; i++) {
            for (player of data.deck.hands) {
                if (playerDetails.number == i) {
                    for (card of player[i]) {
                        cardsInRound++;
                        print(card);
                        currentCards.push(new Card(xPos + 10, 100, 100, 200, card.suit, card.number));
                        xPos += 110;
                    }
                }
            }
        }

        plusButton = new Button(400, 400, 100, 100, '+', data.deck.trump.suit);
        minusButton = new Button(500, 400, 100, 100, '-', data.deck.trump.suit);
        bidButton = new Button(400, 500, 200, 100, 'Bid:0', data.deck.trump.suit);
        currentCards.push(new Card(120, 400, 200, 400, data.deck.trump.suit, "Trump"));

    }
}

function mousePressed() {
    for (card of currentCards) {
        if (card.hitTest()) {
            print(card.number);
            sendData('cardPlayed', { id: playerDetails.id, playerNumber: playerDetails.number, suit: card.suit, number: card.number });
        }
    }

    if (plusButton.hitTest() == true) {
        bidValue = (bidValue < cardsInRound ? bidValue + 1 : cardsInRound);
        bidButton.text = "Bid:" + bidValue.toString();
    }
    if (minusButton.hitTest() == true) {
        bidValue = (bidValue > 0 ? bidValue - 1 : 0);
        bidButton.text = "Bid:" + bidValue.toString();
    }
    if (bidButton.hitTest() == true) {
        displayBiddingText = false;
        sendData("incomingBid", { playerNumber: playerDetails.number, bid: bidValue });
    }
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}