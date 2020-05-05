class Players {
    constructor() {
        this.activePlayers = [];
    }

    addPlayer(player) {
        this.activePlayers.push(player);
    }

    getPlayer(id) {
        for (var i = 0; i < this.activePlayers.length; i++) {
            if (this.activePlayers[i].id === id) {
                return this.activePlayers[i];
            }
        }
        console.error("Player id not found");
    }

    getPlayerByIndex(index) {
        for (var i = 0; i < this.activePlayers.length; i++) {
            if (this.activePlayers[i].number === index) {
                return this.activePlayers[i];
            }
        }
        console.error("Player index not found");
    }

    getNumberOfPlayers() {
        return this.activePlayers.length;
    }

    playACardForPlayer(id, card, dealer) {
        return this.getPlayer(id).playACard(card, dealer);
    }

    getInstructionsForPlayer(id) {
        return this.getPlayer(id).instructions;
    }

}