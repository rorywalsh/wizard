class Cards {
    constructor() {
        this.cards = [];
        this.hands = [];

        this.trump = ';'
        this.suits = ['red', 'blue', 'green', 'yellow'];
        for (var i = 0; i < 13; i++) {
            for (var suit = 0; suit < 4; suit++) {
                this.cards.push({ suit: this.suits[suit], number: i, shouldDisplay: true });
            }
        }

        for (var suit = 0; suit < 4; suit++) {
            this.cards.push({ suit: this.suits[suit], number: 'w', shouldDisplay: true });
        }

        // for (var i = 0; i < this.cards.length; i++)
        //     print(this.cards[i]);
    }

    deal(numCards, numPlayers) {
        var handsTmp = new Array(numPlayers);
        if (this.cards.length > numCards) {
            for (var player = 0; player < numPlayers; player++) {
                handsTmp[player] = new Array(numCards);
                // print("Player:", player);
                for (var i = 0; i < numCards; i++) {
                    var cardIndex = int(random(0, this.cards.length));
                    // print(this.cards[cardIndex]);
                    handsTmp[player][i] = (this.cards[cardIndex]);
                    this.cards.splice(cardIndex, 1);
                }

            }
            this.hands.push(handsTmp);
            // var handsTmp = new Array(3);
            // handsTmp[0] = new Array(3);
            // handsTmp[0][0] = { suit: this.suits[0], number: 1, shouldDisplay: true };
            // handsTmp[0][1] = { suit: this.suits[1], number: 1, shouldDisplay: true };
            // handsTmp[0][2] = { suit: this.suits[2], number: 1, shouldDisplay: true };
            // handsTmp[1] = new Array(3);
            // handsTmp[1][0] = { suit: this.suits[3], number: 2, shouldDisplay: true };
            // handsTmp[1][1] = { suit: this.suits[0], number: 2, shouldDisplay: true };
            // handsTmp[1][2] = { suit: this.suits[1], number: 2, shouldDisplay: true };
            // handsTmp[2] = new Array(3);
            // handsTmp[2][0] = { suit: this.suits[2], number: 4, shouldDisplay: true };
            // handsTmp[2][1] = { suit: this.suits[3], number: 4, shouldDisplay: true };
            // handsTmp[2][2] = { suit: this.suits[0], number: 4, shouldDisplay: true };
            // this.hands.push(handsTmp);

            // print("Number of cards reminaing:", this.cards.length);
            this.trump = this.cards[int(random(0, this.cards.length))];

        } else
            print("Not enough cards remaining for a deal");
    }


}