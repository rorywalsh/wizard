//player class 
class WizardPlayer extends BasePlayer {
    constructor(id, number) {
        super(id, number);
        this.bid = -1;
        this.handsWon = 0;
    }
};

//main game state class
class GameState {
    constructor() {
        this.players = [];
        this.score = 0;
        this.cards = null;
        this.dealer = 0;
        this.round = 1;
        this.currentBidder = 0;
        this.numberOfBids = 0;
        this.winnerOfLastHand = -1;
        this.playerToPlay = 0;
        this.cardsPlayedInCurrentHand = 0;
        this.tricksPlayed = 0;
        this.cardsPlayed = [];
        this.acesHigh = true;
        this.state = '';
    }

    addCards(cards) {
        this.cards = cards;
    }

    getNumberOfPlayers() {
        return this.players.length;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    dealCards(numberOfCards) {
        print(this.cards.length);
        if (this.cards.length > numberOfCards) {
            for (var player = 0; player < this.players.length; player++) {
                this.players[player].currentCards = new Array(numberOfCards);
                for (var i = 0; i < numberOfCards; i++) {
                    var cardIndex = int(random(0, this.cards.length));
                    this.players[player].currentCards[i] = (this.cards[cardIndex]);
                    this.cards.splice(cardIndex, 1);
                }
                console.log(this.players[player].currentCards);
            }
        } else
            console.log("Not enough cards remaining for a deal");
    }


    setAcesHigh(acesAreHigh) {
        this.acesHigh = acesAreHigh;
    }

    findHighestCard(cards) {

    }

    findLowestCard(cards) {

    }

    findCard(card) {

    }

    findBestRun(cards) {

    }

    findBestFlush(cards) {

    }

    findBestSetOfTwo(cards) {

    }

    findBestSetOfThree(cards) {

    }

    findBestSetOfFour(cards) {

    }

    setTrump() {

    }

    getPlayer(id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
    }

}