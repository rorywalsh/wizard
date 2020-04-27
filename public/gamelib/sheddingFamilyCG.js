class SheddingFamilyCardGame extends BaseCardGame {
    constructor(minNumberPlayers, maxNumberPlayers, isPlayedClockwise) {
        if (new.target === SheddingFamilyCardGame) {
            throw new TypeError("Cannot construct abstract shedding family card game directly");
        }
        else
        {
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