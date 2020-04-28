//main game state class
class GameState {
    constructor() {
        this.players = [];
        this.discardPile = [];
        this.score = 0;
        this.deck = null;
        this.dealer = 0;
        this.round = 1;
        this.currentBidder = 0;
        this.numberOfBids = 0;
        this.winnerOfLastHand = -1;
        this.playerUp = 0;
        this.cardsPlayedInCurrentHand = [];
        this.tricksPlayed = 0;
        this.acesHigh = true;
        this.state = '';
    }

    setGameType(type) {
        this.gameType = type;
        this.addCards(this.gameType.getCardDeck());
    }

    addCards(cards) {
        this.deck = cards;
        console.log(this.deck);
    }

    getNumberOfPlayers() {
        return this.players.length;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    dealCards(numberOfCards) {
        if (this.deck.length > numberOfCards) {
            for (var player = 0; player < this.players.length; player++) {
                this.players[player].currentCards = new Array(numberOfCards);
                for (var i = 0; i < numberOfCards; i++) {
                    var cardIndex = int(random(0, this.deck.length));
                    this.players[player].currentCards[i] = (this.deck[cardIndex]);
                    this.deck.splice(cardIndex, 1);
                }
                console.log(this.players[player].currentCards);
            }
        } else
            console.log("Not enough cards remaining for a deal");
    }

    getDiscardPile() {
        return this.discardPile;
    }

    getDeck() {
        return this.deck;
    }

    turnCardFromDeck() {
        let cardIndex = int(random(this.deck.length));
        //console.log(this.deck[cardIndex]);
        this.discardPile.push(this.deck[cardIndex]);
        this.deck.splice(cardIndex, 1);
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