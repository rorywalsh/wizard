/*
2: if a player places a two (of any suit) down, the next player is required to pick up two cards.You can not place two 2 cards down at the 
same time Should that player have a two himself, however, instead of taking cards he may place it down, requiring the next player to take 
four, this continues until a player with no two has to pick up the current total. A player that draws cards after a two has been played is 
usually not permitted to put any more cards down. 
Q: you can cover the queen with any card of the players choice 
8: the next player misses  their turn. There is not usually the option for the next player to play an 8 if he or she has any, as there is with the 2; however, if this rule is included, then 8s will continue to be played, until the flow reaches a player without an 8, in which case he will miss a number of 
turns equivalent to the number of 8s played immediately previously. 
King: king reverses the play direction 
Black Jack: When the Black Jack is played, the following player must pick up the same number of cards dealt or play another Black Jack and the following player must then pick up double that. If you have both Black Jacks then you can play both of them at the same time, to then cause the next person to pick up. 
Red Jack: Is best played when a Black Jack is played as this will cancel the pick up black jack rule. One red Jack cancels one black 
jack. 
Ace: can be played regardless of the suit or value of the topmost card on the playing deck—that is, the Ace may be played at any time 
in the game. When playing an Ace, the player can decide freely the suit that has to be played next; from then on, play continues as normal, 
but on the suit selected by the player of the Ace. 
*/

class Switch extends SheddingFamilyCardGame {
    constructor() {
        var minNumberPlayers = 2;
        var maxNumberPlayers = 5;
        super(minNumberPlayers, maxNumberPlayers);
        this.addCardDeck(CardDecks.createDefault52FrenchSuitedPack());
        this.trickCards = [2, 8, 11, 12, 13, 14]; //2, 8, J, Q, K, A
    }

    //if card was picked from deck, it's the next players move
    static goToNextPlayer(move) {
        if ('card picked from deck')
            return true;
        else
            return false;
    }

    //method to validate any card dropped to the discard pile
    static validateMove(discardPile, card, numberOfCards, currentPlayer) {
        const lastCardIndex = discardPile.length - 1;
        if (numberOfCards == 1) {
            if (card.suit != discardPile[lastCardIndex].suit)
                return {
                    message: "Try again: Last card can't be a trick card",
                    instruction: ""
                };
        } else {
            if (card.suit === discardPile[lastCardIndex].suit) {
                if (card.number === 2) {
                    return {
                        message: 'Player played a 2 - next player picks 2 cards',
                        instruction: "Pick up 2"
                    };
                } else if (card.number == 10) {
                    if (card.suit === 'clubs' || card.suit === 'spades') {
                        if (discardPile.length > 1 && discardPile[lastCardIndex - 1].number === 10 &&
                            discardPile[lastCardIndex - 1].suit === 'clubs' || discardPile[lastCardIndex - 1].suit === 'spades')
                            return {
                                message: "Player played a black jack on a black jack - next player picks up 10",
                                instruction: "Pick up 10"
                            };
                        else
                            return {
                                message: "Player played a black jack - next player picks up 5",
                                instruction: "Pick up 5"
                            };
                    } else
                        return { message: "Player played a red jack - cancels any trick moves against them" };
                } else if (card.number === 13) {
                    return { message: "Player played an King - reverses play" };
                } else {
                    return {
                        message: "Player has followed suit",
                        instruction: ""
                    };
                }
            } else if (card.number === discardPile[lastCardIndex].number) { //normal play
                return {
                    message: "Player has matched number and switched suit",
                    instruction: ""
                };
            } else if (card.number === 12) { //queen
                return {
                    message: "Player played an Queen",
                    instruction: ""
                };
            } else if (card.number === 14) { //ace
                return {
                    message: "Player played an ACE - now gets to decide next suit",
                    instruction: "Choose next suit"
                };
            } else if (discardPile[lastCardIndex].number === 2 && card.number === 2) {
                let numberOfCardsToPickUp = 4;
                if (discardPile.length > 1 && discardPile[lastCardIndex - 1].number === 2) {
                    numberOfCardsToPickUp = 6;
                }
                if (discardPile.length > 2 && discardPile[lastCardIndex - 1].number === 2 && discardPile[lastCardIndex - 2].number === 2) {
                    numberOfCardsToPickUp = 8;
                }
                return {
                    message: "Player has played has played a 2 on some previous 2s - next player picks " + numberOfCardsToPickUp,
                    instruction: "Pick up " + numberOfCardsToPickUp
                };

            } else return { message: "Illegal move" };
        }
    }
}