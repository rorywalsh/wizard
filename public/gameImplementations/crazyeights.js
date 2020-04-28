class CrazyEights extends SheddingFamilyCardGame {
    constructor() {
        var minNumberPlayers = 2;
        var maxNumberPlayers = 5;
        super(minNumberPlayers, maxNumberPlayers);
        this.addCardDeck(CardDecks.createDefault52FrenchSuitedPack());
    }
}


class CrazyEightsPlayer extends BaseCardPlayer {
    constructor(id, number) {
        super(id, number);
        this.id = id;
        this.number = number;
    }
}