class Game {
    constructor(minNumberPlayers, maxNumberPlayers, isPlayedClockwise) {
        if (new.target === Game) {
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

class SheddingFamilyCardGame extends Game {
    constructor(minNumberPlayers, maxNumberPlayers, isPlayedClockwise) {
        if (new.target === SheddingFamilyCardGame) {
            throw new TypeError("Cannot construct abstract shedding family card game directly");
        } else {
            super(minNumberPlayers, maxNumberPlayers, isPlayedClockwise);
        }
    }

    drawCards(numberOfCards) {
        let cardsToDraw = [];
        for (var i = 0; i < numberOfCards; i++) {
            cardsToDraw.push(this.cards)
        }
        return cardsToDraw;
    }
}

class TrickTakingCardGame extends Game {
    constructor() {
        if (new.target === TrickTakingCardGame) {
            throw new TypeError("Cannot construct abstract trick taking card game instance directly");
        } else {

        }
    }
}