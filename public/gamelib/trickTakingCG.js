class TrickTakingCardGame extends BaseCardGame {
    constructor() {
        if(new.target === TrickTakingCardGame) {
            throw new TypeError("Cannot construct abstract trick taking card game instance directly");
        }
        else {
            
        }
    }
}