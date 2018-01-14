//written assuming 8x8 Grid size
describe("Map Space To Grid", function(){ 
   it("given a space value, returns pair of numbers if space is valid",
   	function(){ 
    	expect(mapSpacetoGrid("B", 7)).toEqual([1, 6]); 
    	expect(mapSpacetoGrid("a", 1)).toEqual([0, 0]); 
   }); 
    
   it("if space is invalid/out of range, returns false", function(){
      expect(mapSpacetoGrid("Z", 4)).toEqual(false); 
      expect(mapSpacetoGrid("C", 12)).toEqual(false); 
   });   
   

});

describe("Ship class", function(){
	it("should have a size and type defined on initalization", function(){
		let battleship = new Ship("battleship");
		expect(battleship.type).toEqual("battleship");
		expect(battleship.size).toEqual(SHIP_SIZE["battleship"]);
	});
});


describe("Grid class", function(){
	let player_grid = new Grid();
	let destroyer = new Ship("destroyer");
	let battleship = new Ship("battleship");

	it("should initialize spaces as unoccupied and untargeted", function(){
		expect(player_grid.spaces[0][0].occupied).toEqual(false);
		expect(player_grid.spaces[0][0].targeted).toEqual(false);
	});
	describe("Placing ships on grid", function(){
		beforeAll(function(){
			player_grid.place(destroyer, ["B", 1],"h");
			player_grid.place(battleship, ["a", 6],"v");
		});
		it("should place a ship on the grid with given orientation", function(){
			expect(player_grid.spaces[1][0].occupied).toEqual(true);
			expect(player_grid.spaces[1][1].occupied).toEqual(true);

			expect(player_grid.spaces[0][5].occupied).toEqual(true);
			expect(player_grid.spaces[1][5].occupied).toEqual(true);
			expect(player_grid.spaces[2][5].occupied).toEqual(true);
			expect(player_grid.spaces[3][5].occupied).toEqual(true);
			expect((Object.keys(player_grid.ships_remaining)).length).toEqual(2)
		});
		it("should identify which ship is on a given space", function(){
			expect(player_grid.spaces[1][0].ship).toEqual("destroyer");
			expect(player_grid.spaces[3][5].ship).toEqual("battleship");

		});
		it("should not allow a ship to be placed on an already occupied space",function(){
			expect(player_grid.place(destroyer, ["B", 1],"v")).toEqual(false);

		});
		describe("Attacking a grid space", function(){
			it("should report an empty space as a 'Miss'", function(){
				expect(player_grid.attack(["F", 1])).toEqual("Miss");
			});
			it("should return an attack on an occupied space as a 'Hit'", function(){
				expect(player_grid.attack(["B", 1])).toEqual("Hit");
			});
			it("should mark a downned ship as sunk", function(){
				expect(player_grid.attack(["B", 2])).toEqual("The destroyer has been sunk");
				expect((Object.keys(player_grid.ships_remaining)).length).toEqual(1)

			});
		});
	});
});

