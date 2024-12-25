import { readInputToArray } from '../input-utils';

const grid: number[][] = readInputToArray('input.txt').map(line => line.split('').map(Number));
const directions: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
] 

// process starting positions
let startPositions: number[][] = [];
for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
        if (grid[i][j] === 0)
            startPositions.push([i, j]);

function findTrailheadPeaks(i: number, j: number, visitedPeaks: Set<string> | null = null): number {
    let trailheads = 0;

    if (grid[i][j] === 9) {
        // for part 1: count peaks visited only once
        if (visitedPeaks !== null) {
            if (!visitedPeaks.has(`${i} ${j}`)) {
                visitedPeaks.add(`${i} ${j}`);
                return 1;
            }
            return 0;
        } 
        // for part 2: count it regardless of however many times we visit it
        return 1;
    }

    // look for available moves in each direction, making sure they are in bounds of the grid
    for (const [di, dj] of directions)
        if (0 <= i+di && i+di < grid.length && 0 <= j+dj && j+dj < grid[0].length)
            if (grid[i+di][j+dj] === grid[i][j] + 1)
                trailheads += findTrailheadPeaks(i+di, j+dj, visitedPeaks);

    return trailheads;
}

let trailheadScore = 0, trailheadRating = 0;

for (const [i, j] of startPositions) {
    let visitedPeaks = new Set<string>();
    trailheadScore += findTrailheadPeaks(i, j, visitedPeaks);
    trailheadRating += findTrailheadPeaks(i, j, null);
}

console.log(`Part 1: ${trailheadScore}`);    // 489
console.log(`Part 2: ${trailheadRating}`);   // 1086