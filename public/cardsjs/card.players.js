class Players {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getPlayer(id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        console.error("Player id not found");
    }

    getPlayerByIndex(index) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].number === index) {
                return this.players[i];
            }
        }
        console.error("Player index not found");
    }

    getNumberOfPlayers() {
        return this.players.length;
    }
}