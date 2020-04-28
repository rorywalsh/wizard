//player class 
class BaseCardPlayer {
    constructor(id, number) {
        this.id = id;
        this.number = number;
        this.handsWon = 0;
        this.score = 0;
        this.name = 'Player ' + number;
        this.currentCards = [];
    }
};