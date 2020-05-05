//main game state class
class Dealer {
    constructor() {
        // this.players = [];
        this.numberOfPlayers = 0;
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
    setupNewGame(type) {
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
        return this.numberOfPlayers;
    }

    //dealer returns number of player
    setNumberOfPlayers(num) {
        this.numberOfPlayers = num;
    }

    //dealer adds player
    // addPlayer(player) {
    //     this.players.push(player);
    // }

    //called when dealer deals cards
    dealCardsToPlayers(numberOfCards, players) {
        if (this.deck.length > numberOfCards) {
            for (var index = 0; index < players.getNumberOfPlayers(); index++) {
                players.getPlayerByIndex(index).currentCards = new Array(numberOfCards);
                for (var i = 0; i < numberOfCards; i++) {
                    var cardIndex = int(random(0, this.deck.length));
                    players.getPlayerByIndex(index).currentCards[i] = (this.deck[cardIndex]);
                    this.deck.splice(cardIndex, 1);
                }
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
    validate(player, card) {
        // let player = Object.assign(new Player(), activePlayer);
        //can't access this.gameType.validateMove() for some reason??!±?!!? 
        let returnObj = Switch.validateMove(this.discardPile, card, player.currentCards.length);
        console.log(returnObj);
        let cardIndex = this.indexOfCardInCurrentCards(player.currentCards, card);
        if (returnObj.message != 'Illegal move') {
            this.discardPile.push({ suit: card.suit, number: card.number });
            player.currentCards.splice(cardIndex, 1);
            this.playerUp = this.playerUp < this.getNumberOfPlayers() - 1 ? this.playerUp + 1 : 0;
            this.instructions = { player: this.playerUp, instruction: returnObj.instructions };
        }
        return returnObj;
    }

    //get instructions for a player
    getInstructionsForPlayer(player) {
        if (player && this.instructions) {
            if (this.instructions.player == player.number)
                return this.instructions.instruction;
            else return "It's not your turn";
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
        this.discardPile.push(this.deck[cardIndex]);
        this.deck.splice(cardIndex, 1);
    }

    //dealer picks card for player
    dealCardFromDeckForPlayer(player) {
        //in switch no trick cards can be played in the opening draw...
        let cardIndex = int(random(this.deck.length));
        player.currentCards.push(this.deck[cardIndex]);
        this.deck.splice(cardIndex, 1);
        if (player.instructions) {
            console.log("Before", player.instructions);
            const index = player.instructions.indexOf('Pick up a card');
            player.instructions.splice(index, 1);
            console.log("After", player.instructions);
        }
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

}