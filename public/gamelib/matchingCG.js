class MatchingCardGame extends BaseCardGame {
    constructor() {
        if (new.target === MatchingCardGame) {
            throw new TypeError("Cannot construct abstract matching card game instance directly");
        } else {

        }
    }
}