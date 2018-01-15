let prompt = require('prompt-sync')();


//	Intro and rules. Welcomes player to game and overviews rules.

let intro_rules = (first_time) =>{
	if(first_time == true){
		console.log("Welcome to Battleship.");
	}

	console.log(`Battleship rules:
	Battleship is a two player game where each player takes turns attempting to sink the other player's ships.

	Each player begins with 5 ships each, the grid is currently set to be ${GRID_SIZE}x${GRID_SIZE}.

	Every turn, a player gets the chance to choose a spot on the Grid to target. If the grid is occupied, it's a hit.
	If it's empty, it's a miss. If the spot has already been called out, then the player must rechoose a spot.

	If all spots a ship occupies are hit, the ship is sunk. The game ends when one player sinks all of the other players' ships.

	Type 'exit' to quit the game`);

	return;
};




//driver function to actually run game
let gameDriver = () =>{
	intro_rules(true);
	let boards = [];
	boards[0] = new Grid();
	boards[1] = new Grid();
	let letter_max = String.fromCharCode(GRID_SIZE+65-1);
	let player_place = (player) =>{
		console.log(`\n\n\n\n\n\n\n\n\n\nPlayer ${player}, it's time to place your ships on the grid.`)
		for(let i in SHIP_SIZE){
			let ship = new Ship(i)
			let placed = false;
			while(placed == false){
				console.log(`A ${ship.type} is ${SHIP_SIZE[i]} spaces long.`)
				console.log(`Where on the board would you like the ship placed? The location you give will be the starting point, and the ship will take up successive spaces to the right (horizontally) or down (vertically).`);
				console.log("Would you like this ship placed horizontally or vertically");

				let o = prompt("Type 'v' for vertical or 'h' for horizontal");
				if(o.toLowerCase() == 'exit'){
					return;
				}
				let space = [];
				space[0] = prompt('Type the letter of the row you would like your ship to start on (A-' + 'letter_max)\n');
				if(space[0].toLowerCase() == 'exit'){
					return;
				}
				space[1] = prompt('Type the number of the column you would like your ship to start on (1-' + GRID_SIZE +')\n');
				if(space[1].toLowerCase() == 'exit'){
					return;
				}
				placed = boards[player-1].place(ship, space, o);
			}
		}
	};
	player_place(1);
	console.log("Player 1 is ready to play!\n\n\n\n\n");
	player_place(2);
	console.log("Player 2 is ready to play!\n\n\n\n\n");

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
				space[0] = prompt('Type the letter of the row you would like to attack (A-' + 'letter_max)\n');
				if(space[0].toLowerCase() == 'exit'){
					return;
				}
				space[1] = prompt('Type the number of the column you would like to attack (1-' + GRID_SIZE +')\n');
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


