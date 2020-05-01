//player class 
class Player {
    constructor(id, number) {
        console.log("Adding new player - ", id, number);
        this.id = id;
        this.name = name;
        this.number = number;
        this.handsWon = 0;
        this.score = 0;
        this.name = 'Player ' + number;
        this.currentCards = [];
    }

    // //called when a user presses a particular card
    // playACard(card) {
    //     //if move is legal....
    //     if (dealer.cardPlayed(dealer.getPlayer(id), card).message != 'Illegal move') {
    //         //when card is played, remove it from current hand...
    //         cardsInPlayersHand.splice(dealer.indexOfCardInCurrentCards(cardsInPlayersHand, card), 1);
    //         sendData("gameState", dealer);
    //     }
    // }

    // //called when a user picks a card from the deck
    // pickACardFromTheDeck() {
    //     dealer.pickCardFromDeck(dealer.getPlayer(id));
    //     //update global game state
    //     sendData("gameState", dealer);
    // }

    // //called when a user picks a card from the deck
    // pickACardFromTheHand(card) {
    //     console.log('You just selected ' + card.suit + ' ' + card.number);
    // }

};