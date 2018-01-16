/*
 *	This file contains the functions that actually run the game itself.
 */
'use strict';

let prompt = require('prompt-sync')();
let app = require('./grid.js');
let colors = require('colors/safe'); 
//	Intro and rules. Welcomes player to game and overviews rules.

let intro_rules = () =>{
	console.log(colors.bold(`Welcome to Battleship!
Battleship is a two player game where each player takes turns attempting to sink the other player's ships.

Each player begins with 5 ships each, the grid is currently set to be ${app.GRID_SIZE}x${app.GRID_SIZE}.

Every turn, a player gets the chance to choose a spot on the Grid to target. If the grid is occupied, it's a hit.

If it's empty, it's a miss. If the spot has already been called out, then the player must rechoose a spot.

If all spots a ship occupies are hit, the ship is sunk. The game ends when one player sinks all of the other players' ships.

While playing, type 'exit' to quit the game`));
	console.log("\nPress 'enter' key to continue");
	prompt();
	return;
};

/*
 *	Function to facilitate placing process for each player.
 *	Returns the board that is created.
 *
 */
let player_place = (board, player) =>{
	console.log(colors.bold(`\n\n\n\n\n\n\n\n\n\nPlayer ${player}, it's time to place your ships on the grid. NOTE: Input will be hidden while typing.`));
	for(let i in app.SHIP_SIZE){
		let ship = new app.Ship(i);
		let placed = false;
		while(placed == false){
			console.log(`\nA ${ship.type} is ${app.SHIP_SIZE[i]} spaces long.\n`)
			console.log("Where on the board would you like the ship placed? The location you give will be the starting point");
			console.log("The ship will take up successive spaces to the right on the same row (horizontally) or down on the same column (vertically).");
			console.log("Would you like this ship placed horizontally or vertically? Type 'v' for vertical or 'h' for horizontal");
			let o = prompt();
			if(o.toLowerCase() == 'exit'){
				return false;
			}
			let space = [];
			console.log(colors.bold("\nWhat space will the ship be placed on?"));
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
			placed = board.place(ship, space, o);
		}
	}
	return board;
};

let letter_max = String.fromCharCode(app.GRID_SIZE+65-1);

let row = colors.bold(`\nType the letter of the row (A-${String.fromCharCode(app.GRID_SIZE+65-1)})`);
let col = colors.bold(`\nType the number of the column (1-${app.GRID_SIZE })`);
//driver function to actually run game
let gameDriver = () =>{
	intro_rules();
	let boards = [];
	boards[0] = new app.Grid();
	boards[1] = new app.Grid();
	console.log("Now, both players will have a chance to place their ships. It's advisable to tell your opponent to look away.");
	let temp1 = player_place(boards[0], 1);
	if(temp1 == false){
		return;
	}
	boards[0] = temp1;
	console.log("Player 1 is ready to play!\n\n\n\n\n");
	let temp2 = player_place(boards[1], 2);
	if(temp2 == false){
		return;
	}
	boards[1] = temp2;

	console.log("Player 2 is ready to play!\n\n\n\n\n");

	console.log("Now the game officially begins! Each player will take turns attacking until the other is out of ships.\n\n\n");
	let moves = [];
	moves.push([]);
	moves.push([]);
	let win = false;
	//main game loop
	//each iteration represents 1 round (each player gets a chance to attack)

	while(1){
		let space = [];

		for(let i = 1; i <= 2; i++){
			let attack = false;
			while(attack == false){
				console.log(colors.bold(`\n\n\nPlayer ${i}'s turn\n\n\n`));
				//status report
				console.log("Status report:");
				console.log(`Player 1 has ${Object.keys(boards[0].ships_remaining).length} ships remaining.\n\n`);
				console.log(`Player 2 has ${Object.keys(boards[1].ships_remaining).length} ships remaining.\n\n`);

				if(moves[i-1].length>0){
					console.log("Prior moves:");
					console.log(moves[i-1].join(", "));
				}
				console.log(colors.bold('What space would you like to attack?\n'));
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

				//track valid moves
				if(attack != false){
					//keep track of moves
					moves[i-1].push(`${space[0]}${space[1]}`);
				}

			}
			//result of attack
			if(attack == "Miss"){
				console.log(colors.red(attack));
			}
			else{
				console.log(colors.green(attack));

			}
			//check victory condition after each attack
			if(i == 1){
				if((Object.keys(boards[1].ships_remaining).length == 0)){
					console.log(colors.bold("Player 1 wins!"));
					return;
				}
			}
			else{
				if((Object.keys(boards[0].ships_remaining).length == 0)){
					console.log(colors.bold("Player 2 wins!"));
					return;
				}
			}

		}
	}
	return;
};

gameDriver();


