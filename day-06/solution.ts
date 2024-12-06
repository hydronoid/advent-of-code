import { readInputToArray } from '../input-utils';

let grid: string[] = readInputToArray('input.txt');

let startPos: number[] = [-1, -1];
let directions: number[][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let visitedP1: { [key: string]: boolean } = {};

// find the starting position '^'
for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
        if (grid[i][j] == '^')
            startPos = [i, j];

function traverse(pos: number[], visited: { [key: string] : boolean }, newObstructionPos: number[] = [-1, -1]): boolean {
    let currentDirection = directions[0]; // start off going upwards
    let dirIdx = 0;
    let [i, j] = pos;
    let [iObstruction, jObstruction] = newObstructionPos; 

    // part 2: keep track of the position whenever we hit an obstruction
    // in order to detect a loop, we check if it's the same pos as the last time we hit it
    // key: position of the obstruction, value: position where we bump into it
    let obstructionHistory: { [key: string]: number[] } = {};

    while (true) {
        let new_i: number = i + currentDirection[0]
        let new_j: number = j + currentDirection[1];
        let currentPosKey: string = JSON.stringify([i, j]);

        if (new_i < 0 || new_i >= grid.length || new_j < 0 || new_j >= grid[0].length) {
            visited[currentPosKey] = true;
            break;
        }
        
        if (grid[new_i][new_j] === '#' || new_i === iObstruction && new_j === jObstruction) {
            // part 2: check the last position when hitting this obstacle
            let obstructionPosKey: string = JSON.stringify([new_i, new_j]);
            if (obstructionHistory[obstructionPosKey]?.[0] === i && obstructionHistory[obstructionPosKey]?.[1] === j)
                return true;
            
            obstructionHistory[obstructionPosKey] = [i, j];
            
            // rotate direction 90 degrees, i.e. the next element in the directions array
            currentDirection = directions[++dirIdx % directions.length];
            continue;
        }
        visited[currentPosKey] = true;
        i = new_i;
        j = new_j;
    }
    return false;
}

traverse(startPos, visitedP1);

let loops = 0;

// use visited positions from part 1 as the possible obstruction positions
for (let pos of Object.keys(visitedP1)) {
    let newObsPos: number[] = JSON.parse(pos);
    let visitedP2: { [key: string]: boolean } = {};
    if (traverse(startPos, visitedP2, newObsPos))
        loops++;
}

console.log(`Part 1: ${Object.keys(visitedP1).length}`);    // 5208
console.log(`Part 2: ${loops}`);                            // 1972