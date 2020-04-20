class Cards {
    constructor() {
        this.cards = [];
        this.hands = [];

        this.trump = ';'
        this.suits = ['red', 'blue', 'green', 'orange'];
        for (var i = 0; i < 13; i++) {
            for (var suit = 0; suit < 4; suit++) {
                this.cards.push({ suit: this.suits[suit], number: i, shouldDisplay: true });
            }
        }

        for (var suit = 0; suit < 4; suit++) {
            this.cards.push({ suit: this.suits[suit], number: 'W', shouldDisplay: true });
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

            this.trump = this.cards[int(random(0, this.cards.length))];

        } else
            print("Not enough cards remaining for a deal");
    }


}