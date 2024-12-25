import { readInputToArray } from '../input-utils';

const data: number[][] = readInputToArray('input.txt').map(line => line.split(',').map(Number));
const GRID_SIZE = 71;
const BYTES_TO_FALL = 1024;
const DIRECTIONS: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

function isInBounds(x: number, y: number): boolean {
    return 0 <= x && x < grid.length 
        && 0 <= y && y < grid[0].length;
}

function bfs(xStart: number, yStart: number, grid: string[][]): { [key: string]: number } {
    let visited = new Set<string>();
    let distances: { [key: string]: number } = {};
    distances[JSON.stringify([xStart, yStart])] = 0;

    let queue: number[][] = [[xStart, yStart]];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentKey = JSON.stringify(current);
        visited.add(currentKey);

        for (let [dx, dy] of DIRECTIONS) {
            const x2 = current[0] + dx;
            const y2 = current[1] + dy;
            const neighbourKey = JSON.stringify([x2, y2]);

            // valid neighbours are in bounds, not corrupted cells, and are not visited
            if (isInBounds(x2, y2) && grid[x2][y2] === '.' && !visited.has(neighbourKey)) {
                distances[neighbourKey] = distances[currentKey] + 1;
                visited.add(neighbourKey);
                queue.push([x2, y2]);
            }
        }
    }
    return distances;
}

// make the first 1024 bytes fall
let grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('.'));
data.forEach((line, i) => {
    if (i >= BYTES_TO_FALL)
        return;

    const [x, y] = line;
    grid[y][x] = '#';
});

// Part 1
const exit: string = JSON.stringify([GRID_SIZE-1, GRID_SIZE-1]);
let exitSteps: number = bfs(0, 0, grid)[exit];

// Part 2 - brute force :)
let exitBarrierPos: string = '';
for (let i = BYTES_TO_FALL; i < data.length; i++) {
    const [x, y] = data[i];
    grid[y][x] = '#';

    // distances[exit] undefined -> exit not reachable
    if (!bfs(0, 0, grid)[exit]) {
        exitBarrierPos = [x, y].join(',');
        break;
    }
}

console.log(`Part 1: ${exitSteps}`);        // 340
console.log(`Part 2: ${exitBarrierPos}`);   // 34, 32