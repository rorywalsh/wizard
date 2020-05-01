This folder contains all the abstract JS class and source file to create a basic game

* card.game.js - base class for card game - extend this class for each new game type 
* card.game.switch.js - a switch game class, derived from Game class..
* card.game.moamoa.js - a MoaMoa game class, derived from Game class..
* card.deck.js - an abstract class representing a type of deck, FrenchSuited, Uno, etc.. the dekc, and all its cards are passed to the dealer when a new game is set up
* card.dealer.js - an abstract class represents the dealer with methods for dealing cards, setting up new games, verifying moves, sending instructions to players, etc..
* card.player.js - represent a single player, and included method for playing a card, picking a card from the deck, etc..
* card.players.js - a class that holds all players with methods for adding players, accessing player by their data, etc.. 

