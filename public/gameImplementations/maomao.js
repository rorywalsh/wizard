class MaoMao extends SheddingFamilyCardGame {
    constructor() {
        var minNumberPlayers = 2;
        var maxNumberPlayers = 5;
        super(minNumberPlayers, maxNumberPlayers);
        this.addCardDeck(CardDecks.createDefault32FrenchSuitedPack);
    }
}