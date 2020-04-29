class BaseCardGame {
    constructor(minNumberPlayers, maxNumberPlayers, isPlayedClockwise) {
        if (new.target === BaseCardGame) {
            throw new TypeError("Cannot construct abstract card game instance directly");
        } else {
            this.minNumberPlayers = minNumberPlayers;
            this.maxNumberPlayers = maxNumberPlayers;
            this.isPlayedClockwise = isPlayedClockwise;
            this.cards = [];
        }
    }

    addCardDeck(cardDeck) {
        this.cards = cardDeck;
        console.log("You have added a card deck to the game");
    }

    getCardDeck() {
        if (this.cards.length === 0) {
            console.log("You haven't added a card deck to the game");
        } else {
            return this.cards;
        }
    }

}