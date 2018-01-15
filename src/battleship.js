let prompt = require('prompt-sync')();

//	Game size config. Default game implementation is played using an 8x8 grid.
const GRID_SIZE = 8;

/*
 *	Predefined battleship sizes, default is 3 if you want to add a new one 
 *	unless it is defined explictly here.
 */

const SHIP_SIZE = {
	'carrier': 5,
	'battleship': 4,
	'cruiser': 3,
	'submarine': 3,
	'destroyer': 2
};
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

	If all spots a ship occupies are hit, the ship is sunk. The game ends when one player sinks all of the other players' ships.`);

	return;
};


/*
 *	Maps the input space, which is in the format "LetterNumber" 
 *	to grid in 2d space [Number, Number], and returns that value, 0-indexed
 *
 *	Example: Input - B7 => Output: 1, 6
 */
let mapSpacetoGrid = (letter, number) =>{
	if(isNaN(number) || !letter.match(/[A-Za-z]/i)){
		return false;
	}
	let y = number-1;
	let x = letter.toLowerCase().charCodeAt()-97;
	//if space falls out of grid range, ask
	if(x < 0 || x > GRID_SIZE || y < 0 || y > GRID_SIZE){
		console.log("Invalid range entered");
		return false;
	}
	else{
		return [x, y];
	}

}

/*
 *	Class Grid contains:
 *  -Array of NxX Spaces, which know whether position is occupied
 *	has already been targeted, and what ship is currently on the space
 *	-Reference object detailing the remaining ships on the board.
 *
 *	Functions to:
 *	-Place ship on grid
 *	-Attack a space on the grid
 */
class Grid{
	constructor(){
		this.ships_remaining = {};
		//initialize spaces for NxN board
		this.spaces = [];
		for (let i = 0; i < GRID_SIZE; i++){
			this.spaces.push([]);
			for(let j = 0; j < GRID_SIZE; j++){
				this.spaces[i].push({
					"targeted": false,
					"occupied": false,
					"ship": ""
				});
			}
		}
	}

	/*
	 *	Attacks given space, provided it hasn't already attacked.
	 *	Returns:
	 *  "Hit" if ship is occupying the position.
	 *  "Miss" if the space is empty
	 *	"Sunk" if the ship that occupies the position has no spaces remaining.
	 */
	attack(space){
		let target = mapSpacetoGrid(space[0], space[1]);
		let space_selected = this.spaces[target[0]][target[1]];
		//space has already been attacked
		if(target == false){
			console.log("Invalid input for space");
			return false;
		}
		if(space_selected.targeted){
			console.log("Already taken");
			return false;
		}
		else{
			//empty space
			if(!space_selected.occupied){
				return "Miss";
			}
			//space is occupied, mark space as targeted, take one space away from ship
			else{
				space_selected.targeted = true;
				let ship = this.ships_remaining[space_selected.ship];
				ship.remaining -= 1;
				//ship has been sunk, remove from currently active ships array
				if(ship.remaining == 0){
					delete this.ships_remaining[ship.type];
					return `The ${ship.type} has been sunk`;
				}
				else{
					return "Hit";
				}
			}
		}
	}
	/*
	 *	Places ship on grid starting at given space, with given orientation (ships can be placed
	 *	horizontally or vertically on the grid).
	 *	First, check if ship is placed in bounds of grid.
	 *	Then, check to see that it is not overlapping another already placed ship.
	 *	If not, place on grid, marking spaces as occupied and add ship to board
	 *	Returns boolean indicating whether or not ship was placed.
	 */
	place(ship, space, orientation){
		let o = orientation.toLowerCase();
		let start = mapSpacetoGrid(space[0], space[1]);
		if(start == false){
			console.log("Invalid input for space");
		}
		if(o == 'v'){
			if(start[0] + ship.size -1 >= GRID_SIZE){
				console.log("That range is out of bounds.")
				return false;
			}

			for(let i = start[0]; i < start[0] + ship.size; i++){
				if(this.spaces[i][start[1]].occupied == true){
					console.log("Please select a space that is not occupied already.");
					return false;
				}
			}
			for(let i = start[0]; i < start[0] + ship.size; i++){
				this.spaces[i][start[1]].occupied = true;
				this.spaces[i][start[1]].ship = ship.type;
			}
		}
		else if(o == 'h'){
			if(start[1] + ship.size - 1 >= (GRID_SIZE)){
				console.log("That range is out of bounds.")
				return false;
			}
			for(let i = start[1]; i < start[1] + ship.size; i++){
				if(this.spaces[start[0]][i].occupied == true){
					console.log("Please select a space that is not occupied already.");
					return false;					
				}				
			}
			for(let i = start[1]; i < start[1] + ship.size; i++){
				this.spaces[start[0]][i].occupied = true;
				this.spaces[start[0]][i].ship = ship.type;				
			}

		}
		else{
			console.log("Invalid orientation. Enter 'v' for vertical, or 'h' for horizontal.");
			return false;
		}
		this.ships_remaining[ship.type] = ship;
		console.log("Placed successfully!")
		return true;
	}


}

class Ship{
	//	Ship has a size, type, and knows the number of spaces it has remaining (spaces that haven't been hit yet)
	constructor(type){
		this.type = type;
		if(SHIP_SIZE[type]){
			this.size = SHIP_SIZE[type];
		}
		else{
			this.size = 3;
		}
		this.remaining = this.size;
	}

}

let head = "    1  2  3  4  5  6  7  8";
console.log(head);
for(let i = 0; i < GRID_SIZE; i++){
	let row = `${String.fromCharCode(i+65)}`;
	for(let j=0; j < GRID_SIZE; j++){
		row+=" |_";
	}
	row+=" |";
	console.log(row);
}

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
				let space = [];
				space[0] = prompt('Type the letter of the row you would like your ship to start on (A-' + 'letter_max)\n');
				space[1] = prompt('Type the number of the column you would like your ship to start on (1-' + GRID_SIZE +')\n');

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
				space[1] = prompt('Type the number of the column you would like to attack (1-' + GRID_SIZE +')\n');
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


