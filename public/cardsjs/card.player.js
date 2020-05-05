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
        this.instructions = [];
    }

    //called when a user presses a particular card
    playACard(card, dealer) {
        console.log("playing a card");
        //if move is legal....
        if (dealer.validate(this, card).message != 'Illegal move') {
            if (this.instructions) {
                console.log("Before", this.instructions);
                const index = this.instructions.indexOf('Play a card');
                this.instructions.splice(index, 1);
                console.log("After", this.instructions);
            }
            if (this.instructions.length == 0)
                sendData("dealer", dealer);
            return dealer.validate(this, card).instructions;
        }
        return "";
    }


};