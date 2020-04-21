// Abstract deck of cards 

class Cards {
    constructor(numberOfCards, suits, specialCards) {
        this.cards = [];
        this.hands = [];
        this.numberOfCards = 13;
        this.trump = ';'

        //create cards in deck
        this.suits = suits //['red', 'blue', 'green', 'orange'];
        for (var i = 0; i < this.numberOfCards; i++) {
            for (var suit = 0; suits.length < 4; suit++) {
                this.cards.push({ suit: this.suits[suit], number: i });
            }
        }

        //add special cards from specialCards array - i.e, joker, wizards, etc..
        for (var suit = 0; suit < 4; suit++) {
            for (specialCard of specialCards) {
                this.cards.push({ suit: this.suits[suit], number: specialCard, shouldDisplay: true });
            }
        }
    }

    // deal card to players. Returns an array of cards for each player..
    // maybe this should be part of the game state class instead? 
    // dealCards(numCards, numPlayers) {
    //     var handsTmp = new Array(numPlayers);
    //     if (this.cards.length > numCards) {
    //         for (var player = 0; player < numPlayers; player++) {
    //             handsTmp[player] = new Array(numCards);
    //             for (var i = 0; i < numCards; i++) {
    //                 var cardIndex = int(random(0, this.cards.length));
    //                 handsTmp[player][i] = (this.cards[cardIndex]);
    //                 this.cards.splice(cardIndex, 1);
    //             }
    //         }
    //         this.hands.push(handsTmp);
    //         return this.hands

    //     } else
    //         print("Not enough cards remaining for a deal");
    }





}