import { readInputToArray } from '../input-utils';

const grid: string[][] = readInputToArray('input.txt').map(line => line.split(''));
const DIRECTIONS: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

let START: number[] = [-1, -1];
let END:   number[] = [-1, -1];

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === 'S')
            START = [i, j];
        if (grid[i][j] === 'E')
            END = [i, j];
    }
}

function isInBounds(i: number, j: number): boolean {
    return 0 <= i && i < grid.length 
        && 0 <= j && j < grid[0].length;
}

function bfs(iStart: number, jStart: number, grid: string[][], part2Cheat: boolean): { [key: string]: number } {
    let visited = new Set<string>();
    let distances: { [key: string]: number } = {};
    distances[JSON.stringify([iStart, jStart])] = 0;
    let queue: number[][] = [[iStart, jStart]];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentKey = JSON.stringify(current);
        visited.add(currentKey);

        for (let [di, dj] of DIRECTIONS) {
            const i2 = current[0] + di;
            const j2 = current[1] + dj;
            const neighbourKey = JSON.stringify([i2, j2]);
            const isValidMove = (part2Cheat) ? distances[currentKey] + 1 <= 20 : grid[i2][j2] !== '#';
            if (isInBounds(i2, j2) && isValidMove && !visited.has(neighbourKey)) {
                distances[neighbourKey] = distances[currentKey] + 1;
                visited.add(neighbourKey);
                queue.push([i2, j2]);
            }
        }
    }
    return distances;
}

function calculateTimeSave(startToA: number, cheatTime: number, bToEnd: number, startToEnd: number): number {
    const newStartToEnd = startToA + cheatTime + bToEnd;
    return startToEnd - newStartToEnd;
}

const endKey: string = JSON.stringify(END);
const dists: { [key: string]: number } = bfs(START[0], START[1], grid, false);

let part1 = 0, part2 = 0;

for (const key of Object.keys(dists)) {
    const [i, j] = JSON.parse(key);

    // Part 1 - for each track position, check 2 spaces around it
    for (const [di, dj] of DIRECTIONS) {
        const i2 = i + di*2;
        const j2 = j + dj*2;
        const nextKey = JSON.stringify([i2, j2]);
        if (dists[nextKey]) {
            const timeSave = calculateTimeSave(dists[key], 2, dists[endKey] - dists[nextKey], dists[endKey]);
            if (timeSave >= 100)
                part1++;
        }
    }

    // Part 2 - the spaces we check are all reachable nodes within 20 steps (found via BFS)
    const distsWithCheats = bfs(i, j, grid, true);
    for (const nextKey of Object.keys(distsWithCheats)) {
        const [i2, j2] = JSON.parse(nextKey);
        if (grid[i2][j2] !== '#') {
            const timeSave = calculateTimeSave(
                dists[key], 
                distsWithCheats[nextKey], // how many steps we cheat
                dists[endKey] - dists[nextKey],
                dists[endKey]
            );

            if (timeSave >= 100)
                part2++;
        }
    }
}

// Got my best rank on the leaderboard today! 2850/2197

console.log(`Part 1: ${part1}`);    // 1507
console.log(`Part 2: ${part2}`);    // 1037936