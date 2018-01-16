/*
 *	Setup and logic of that the Battleship game is built upon.
 */
'use strict';
//	Game size config. Default game implementation is played using an 8x8 grid.
const GRID_SIZE = 8;

/*
 *	Predefined battleship sizes, game will run with the ships defined here.
 */

const SHIP_SIZE = {
	//'battleship': 4,
	'submarine': 3,
	'cruiser' : 3,
	'destroyer': 2
};


/*
 *	Maps the input space, which is in the format "LetterNumber" 
 *	to grid in 2d space [Number, Number], and returns that value, 0-indexed
 *
 *	Example: Input - B7 => Output: 1, 6
 */
let mapSpacetoGrid = (letter, number) =>{
	if(isNaN(number) || (!letter.match(/[A-Za-z]/i)) || letter.length != 1){
		return false;
	}
	let y = number-1;
	let x = letter.toLowerCase().charCodeAt()-97;
	//if space falls out of grid range, ask
	if(x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE){
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
		//space has already been attacked
		if(target == false){
			console.log("Invalid input for space");
			return false;
		}
		let space_selected = this.spaces[target[0]][target[1]];
		if(space_selected.targeted){
			console.log("Already taken, please pick another space!");
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
			return false;
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

module.exports = { 
	mapSpacetoGrid, 
	Grid, 
	Ship,
	SHIP_SIZE,
	GRID_SIZE
};