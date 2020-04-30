//main game state class
class GameDealer {
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
        this.gameType = null;
        this.instructions = null;
    }

    //create a new game 
    createNewGame(type) {
        this.gameType = type;
        this.setDeck(this.gameType.getCardDeck());
        //in switch, we turn over one card...
        this.turnCardFromDeck();
    }

    //sets deck for dealer
    setDeck(cards) {
        this.deck = cards;

    }

    //dealer returns number of player
    getNumberOfPlayers() {
        return this.players.length;
    }

    //dealer adds player
    addPlayer(player) {
        this.players.push(player);
    }

    //called when dealer deals cards
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

    //return cards in discard pile
    getDiscardPile() {
        return this.discardPile;
    }

    //return player whose turn it is
    getPlayerUp() {
        return this.playerUp;
    }

    //return the current deck - excluding any cards that have been discarded
    getDeck() {
        return this.deck;
    }

    //called when a player has played a card
    playACardForPlayer(player, card) {
        //can't access this.gameType.validateMove() for some reason??!±?!!? 
        let returnObj = Switch.validateMove(this.discardPile, card, player.currentCards.length);
        let cardIndex = this.indexOfCardInCurrentCards(player.currentCards, card);
        if (returnObj.message != 'Illegal move') {
            this.discardPile.push({ suit: card.suit, number: card.number });
            player.currentCards.splice(cardIndex, 1);
            this.playerUp = this.playerUp < this.getNumberOfPlayers() - 1 ? this.playerUp + 1 : 0;
            this.instructions = { player: this.playerUp, instruction: returnObj.instruction };
        }
        return returnObj;
    }

    //get instructions for a player
    getInstructionsForPlayer(player) {
        if (player && this.instructions) {
            if (this.instructions.player == player.number)
                return this.instructions.instruction;
            else return "";
        }

        return "";
    }

    //finds index of players card in cards array - type agnostic
    indexOfCardInCurrentCards(currentCards, card) {
        for (let index = 0; index < currentCards.length; index++) {
            if (currentCards[index].suit === card.suit && currentCards[index].number === card.number)
                return index;
        }
        return -1;
    }

    //dealer turns a card over
    turnCardFromDeck() {
        let cardIndex = int(random(this.deck.length));
        //console.log(this.deck[cardIndex]);
        this.discardPile.push(this.deck[cardIndex]);
        this.deck.splice(cardIndex, 1);
    }

    //dealer picks card for player
    dealCardFromDeckForPlayer(player) {
        //in switch no trick cards can be played in the opening draw...
        let cardIndex = int(random(this.deck.length));
        player.currentCards.push(this.deck[cardIndex]);
        this.deck.splice(cardIndex, 1);
        if (Switch.goToNextPlayer("card pick from deck")) {
            this.playerUp = this.playerUp < this.getNumberOfPlayers() - 1 ? this.playerUp + 1 : 0;
        }
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