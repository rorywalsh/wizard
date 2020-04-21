// Abstract deck of cards 
class Cards {
    static createDeck(numberOfCards, suits, specialCards) {
        let cards = [];

        for (var i = 0; i < numberOfCards; i++) {
            for (var suit = 0; suit < suits.length; suit++) {
                cards.push({ suit: suits[suit], number: i });
            }
        }

        //add special cards from specialCards array - i.e, joker, wizards, etc..
        for (var suit = 0; suit < suits.length; suit++) {
            for (specialCard of specialCards) {
                cards.push({ suit: suits[suit], number: specialCard, shouldDisplay: true });
            }
        }

        return cards; 
    }
}
