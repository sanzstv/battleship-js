# Battleship JavaScript Game

Javascript implementation of the classic board game/Rihanna movie.

To play: Grab a friend (real or imaginary), download this repo and load the game using:
	
	npm install
	node src/battleship.js


and follow the command line prompts and instructions to continue.

Game experience is enhanced by emphatically declaring your moves as you type them.

Unit tests can be run with the command:

	jasmine

Rules:
	Battleship is a two player game where each player takes turns attempting to sink the other player's ships.

	Each player begins with 5 ships each, the grid by default is set to be 8x8.

	Every turn, a player gets the chance to choose a spot on the Grid to target. If the grid is occupied, it's a hit.
	If it's empty, it's a miss. If the spot has already been called out, then the player must choose another spot.

	If all spots a ship occupies are hit, the ship is sunk. The game ends when one player sinks all of the other players' ships.
