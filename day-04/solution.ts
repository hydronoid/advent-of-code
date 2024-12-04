import { readInputToArray } from '../input-utils';

let grid: string[] = readInputToArray('input.txt');
let xmasOccurrences = 0;
let xmasShapeOccurrences = 0;

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] == 'X') {
            // For part 1, search for X's and go in each direction to find 'MAS'
            for (let di of [-1, 0, 1]) {
                for (let dj of [-1, 0, 1]) {
                    if (i + 3*di < 0 || i + 3*di >= grid.length || j + 3*dj < 0 || j + 3*dj >= grid[0].length)
                        continue;
    
                    let possibleM: string = grid[i + 1*di][j + 1*dj];
                    let possibleA: string = grid[i + 2*di][j + 2*dj];
                    let possibleS: string = grid[i + 3*di][j + 3*dj];
                    if ('X' + possibleM + possibleA + possibleS === 'XMAS')
                        xmasOccurrences++;
                }
            }
        } else if (grid[i][j] == 'A') {
            // For part 2, search for A's and look on its diagonals for the shape

            // 'A' cannot exist at the edge for an XMAS shape to exist
            if (i == 0 || j == 0 || i == grid.length-1 || j == grid[0].length-1 )
                continue;

            // diagonals: top-left, top-right, bottom-left, bottom-right
            let tl: string = grid[i-1][j-1];
            let tr: string = grid[i-1][j+1];
            let bl: string = grid[i+1][j-1];
            let br: string = grid[i+1][j+1];
            let diagonals = tl + tr + bl + br;

            // If there are exactly 2 M's and 2 S's surrounding the A, 
            // and the arrangement is not MAM/SAS on the diagonals (top right != bottom left),
            // then we have a valid X-MAS shape
            if ((diagonals.match(/M/g)|| []).length == 2 && (diagonals.match(/S/g)|| []).length == 2 && tr != bl)
                xmasShapeOccurrences++;
        }
    }
}

console.log(`Part 1: ${xmasOccurrences}`);      // 2560
console.log(`Part 1: ${xmasShapeOccurrences}`); // 1910