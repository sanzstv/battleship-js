/*
 *	This file contains the functions that actually run the game itself.
 */
'use strict';

let prompt = require('prompt-sync')();
let app = require('./grid.js');

//	Intro and rules. Welcomes player to game and overviews rules.

let intro_rules = () =>{
	console.log(`Battleship rules:
	Battleship is a two player game where each player takes turns attempting to sink the other player's ships.

	Each player begins with 5 ships each, the grid is currently set to be ${app.GRID_SIZE}x${app.GRID_SIZE}.

	Every turn, a player gets the chance to choose a spot on the Grid to target. If the grid is occupied, it's a hit.
	If it's empty, it's a miss. If the spot has already been called out, then the player must rechoose a spot.

	If all spots a ship occupies are hit, the ship is sunk. The game ends when one player sinks all of the other players' ships.

	While playing, type 'exit' to quit the game`);
	console.log("\nPress 'enter' key to continue");
	prompt();
	return;
};



let row = '\nType the letter of the row (A-' + 'letter_max)';
let col = '\nType the number of the column (1-' + app.GRID_SIZE +')';
//driver function to actually run game
let gameDriver = () =>{
	intro_rules();
	let boards = [];
	boards[0] = new app.Grid();
	boards[1] = new app.Grid();
	let letter_max = String.fromCharCode(app.GRID_SIZE+65-1);
	console.log("Now, both players will have a chance to place their ships. It's advisable to tell your opponent to look away.");
	let player_place = (player) =>{
		console.log(`\n\n\n\n\n\n\n\n\n\nPlayer ${player}, it's time to place your ships on the grid. NOTE: Input will be hidden while typing.`);
		for(let i in app.SHIP_SIZE){
			let ship = new app.Ship(i)
			let placed = false;
			while(placed == false){
				console.log(`A ${ship.type} is ${app.SHIP_SIZE[i]} spaces long.`)
				console.log(`Where on the board would you like the ship placed? The location you give will be the starting point, and the ship will take up successive spaces to the right (horizontally) or down (vertically).`);
				console.log("Would you like this ship placed horizontally or vertically");
				console.log("\nType 'v' for vertical or 'h' for horizontal");
				let o = prompt();
				if(o.toLowerCase() == 'exit'){
					return false;
				}
				let space = [];
				console.log("\nWhat space will the ship be placed on?")
				console.log(row);
				space[0] = prompt.hide();
				if(space[0].toLowerCase() == 'exit'){
					return false;
				}
				console.log(col);
				space[1] = prompt.hide();
				if(space[1].toLowerCase() == 'exit'){
					return false;
				}
				placed = boards[player-1].place(ship, space, o);
			}
		}
		return true;
	};
	if(player_place(1) == false){
		return;
	}
	console.log("Player 1 is ready to play!\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
	player_place(2);
	console.log("Player 2 is ready to play!\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

	console.log("Now the game officially begins! Each player will take turns attacking until the other is out of ships.\n\n\n");

	let win = false;
	//main game loop
	//each iteration represents 1 round (each player gets a chance to attack)
	while(1){
		let space = [];
		for(let i = 1; i <= 2; i++){
			let attack = false;
			while(attack == false){
				console.log(`Player ${i}'s turn\n\n\n`);
				//status report
				console.log("Status report:");
				if(i == 1){
					console.log(`Player 2 has ${Object.keys(boards[1].ships_remaining).length} ships remaining.\n\n\n`);
				}
				if(i ==2){
					console.log(`Player 1 has ${Object.keys(boards[0].ships_remaining).length} ships remaining.\n\n\n`);
				}
				console.log('What space would you like to attack?\n');
				console.log(row);
				space[0] = prompt();
				if(space[0].toLowerCase() == 'exit'){
					return;
				}
				console.log(col);
				space[1] = prompt();
				if(space[1].toLowerCase() == 'exit'){
					return;
				}
				if(i == 1){
					attack = boards[1].attack(space);
				}
				else{
					attack = boards[0].attack(space);
				}
			}
			console.log(attack);
			//check victory condition
			if(i == 1){
				if((Object.keys(boards[1].ships_remaining).length == 0)){
					console.log("Player 1 wins!");
					return;
				}
			}
			else{
				if((Object.keys(boards[0].ships_remaining).length == 0)){
					console.log("Player 2 wins!");
					return;
				}
			}
		}
	}
	return;
};

gameDriver();


