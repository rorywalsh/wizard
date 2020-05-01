// Abstract deck of cards 
class CardDecks {
    static createDefault32FrenchSuitedPack() {
        let cards = [];
        let suits = ['diamonds', 'clubs', 'spades', 'hearts'];
        cards.push(...this.addNumbers(7, 10, suits));
        cards.push(...this.addFaceCards(suits));
        return cards;
    }

    static createDefault52FrenchSuitedPack() {
        let cards = [];
        let suits = ['diamonds', 'clubs', 'spades', 'hearts'];
        cards.push(...this.addNumbers(2, 10, suits));
        cards.push(...this.addFaceCards(suits));
        return cards;
    }

    static createUnoDeck() {
        let cards = [];
        let suits = ['yellow', 'green', 'blue', 'red'];
        cards.push(...this.addNumbers(0, 10, suits));
        // add special cards: skip, reverse etc.
        return cards;
    }

    /************************ private methods ************************/
    static addNumbers(min, max, suits) {
        let cards = [];
        for (var i = min; i <= max; i++) {
            for (var suit = 0; suit < suits.length; suit++) {
                cards.push({ suit: suits[suit], number: i });
            }
        }
        return cards;
    }

    static addFaceCards(suits) {
        let cards = [];
        for (var suit = 0; suit < suits.length; suit++) {
            cards.push({ suit: suits[suit], number: 11 }); //Jacks
            cards.push({ suit: suits[suit], number: 12 }); //Queens
            cards.push({ suit: suits[suit], number: 13 }); //Kings
            cards.push({ suit: suits[suit], number: 14 }); //Aces
        }
        return cards;
    }
}


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

        } else if (cardType === 'Wizard') {}
    }
}