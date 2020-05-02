//player class 
class Player {
    constructor(id, number) {
        console.log("Adding new player - ", id, number);
        this.id = id;
        this.name = name;
        this.number = number;
        this.handsWon = 0;
        this.score = 0;
        this.name = 'Player ' + number;
        this.currentCards = [];
    }

    //called when a user presses a particular card
    playACard(card, dealer) {
        console.log("playing a card");
        //if move is legal....
        if (dealer.validate(this, card).message != 'Illegal move') {
            sendData("dealer", dealer);
            return dealer.validate(this, card).instruction;
        }
        return "";
    }
};