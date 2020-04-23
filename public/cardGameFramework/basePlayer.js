//abstract player class 
class BasePlayer {
    constructor(id, number) {
        if (this.constructor === BasePlayer) {
            throw new TypeError('Abstract class "BasePlayer" cannot be instantiated directly.'); 
        }
        else {
            this.id = id;
            this.number = number;
            this.score = 0;
            this.name = 'Player ' + number;
            this.currentCards = [];
        }
    }
}