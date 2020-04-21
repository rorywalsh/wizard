class Player{
    constructor(id, number){
        this.id = id;
        this.number = number;
        this.bid = -1;
        this.turn = false;
        this.handsWon = 0;
        this.score = 0;
        this.name = 'Player ' + number;
        this.currentCard = { suit: '', value: -1 };
    }
};

class GameState {
    constructor() {
        this.players = [];
        this.currentCards = [];
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

    addCards(cards){
        this.cards = cards;
    }
    
    getNumberOfPlayers(){
        return this.players.length;
    }

    addPlayer(player){
        this.players.push(player);
    }

    dealCards(numberOfCards, numberOfPlayers) {
        var handsTmp = new Array(numberOfPlayers);
        if (this.cards.length > numCards) {
            for (var player = 0; player < numPlayers; player++) {
                handsTmp[player] = new Array(numCards);
                for (var i = 0; i < numCards; i++) {
                    var cardIndex = int(random(0, this.cards.length));
                    handsTmp[player][i] = (this.cards[cardIndex]);
                    this.cards.splice(cardIndex, 1);
                }
            }
            this.hands.push(handsTmp);

        } else
            print("Not enough cards remaining for a deal");
    }


    setAcesHigh(acesAreHigh){
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

    getPlayerFromId(id){

    }

}