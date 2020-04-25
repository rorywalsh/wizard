// Abstract deck of cards 
class Cards {
    static createDeck(numberOfCards, baseCard, cardType, suits, specialCards) {
        let cards = [];
        if (cardType === 'French-suited') {
            for (var i = baseCard; i < baseCard + numberOfCards; i++) {
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
}