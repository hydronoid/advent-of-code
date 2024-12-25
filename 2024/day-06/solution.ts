import { readInputToArray } from '../input-utils';

let grid: string[] = readInputToArray('input.txt');
let startPos: number[] = [-1, -1];
let directions: number[][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

// find the starting position '^'
for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
        if (grid[i][j] == '^')
            startPos = [i, j];

function traverse(pos: number[], visited: { [key: string] : number[] }, newObstructionPos: number[] = [-1, -1]): boolean {
    let currentDirection = directions[0]; // start off going upwards
    let dirIdx = 0;
    let [i, j] = pos;
    let [iObstruction, jObstruction] = newObstructionPos; 

    while (true) {
        let new_i: number = i + currentDirection[0]
        let new_j: number = j + currentDirection[1];
        let currentPosKey: string = JSON.stringify([i, j]);

        // reached outside the grid -> finished traversing
        if (new_i < 0 || new_i >= grid.length || new_j < 0 || new_j >= grid[0].length) {
            visited[currentPosKey] = currentDirection;
            break;
        }
        
        // reached the current position coming from the same direction as the last time we reached it -> loop found
        if (visited[currentPosKey]?.[0] == currentDirection[0] && visited[currentPosKey]?.[1] == currentDirection[1])
            return true;
        
        if (grid[new_i][new_j] === '#' || new_i === iObstruction && new_j === jObstruction) {
            // rotate direction 90 degrees, i.e. the next element in the directions array
            currentDirection = directions[++dirIdx % directions.length];
            continue;
        }
        visited[currentPosKey] = currentDirection;
        i = new_i;
        j = new_j;
    }
    // no loop found
    return false;
}

// Part 1
let visitedP1: { [key: string]: number[] } = {}; // key: position, value: direction
traverse(startPos, visitedP1);

// Part 2
let loops = 0;

// use visited positions from part 1 as the possible obstruction positions
// and then brute force these positions
for (let pos of Object.keys(visitedP1)) {
    let newObsPos: number[] = JSON.parse(pos);
    let visitedP2: { [key: string]: number[] } = {};
    if (traverse(startPos, visitedP2, newObsPos))
        loops++;
}

console.log(`Part 1: ${Object.keys(visitedP1).length}`);    // 5208
console.log(`Part 2: ${loops}`);                            // 1972