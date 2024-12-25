import { readInputToArray } from '../input-utils';

const grid: string[] = readInputToArray('input.txt');
const directions: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

function isInBounds(i: number, j: number): boolean {
    return 0 <= i && i < grid.length 
        && 0 <= j && j < grid[0].length;
} 

function bfs(i: number, j: number): number[] {
    // if grid[i][j] part of a region already visited -> ignore it
    if (visited.has(JSON.stringify([i, j])))
        return [0, 0];

    let queue: number[][] = [[i, j]];
    let perimeter = new Set<string>();
    let beginningSize = visited.size;

    while (queue.length > 0) {
        const current = queue.shift()!;
        visited.add(JSON.stringify(current));

        for (let [di, dj] of directions) {
            const i2 = current[0] + di;
            const j2 = current[1] + dj;
            const posKey = JSON.stringify([i2, j2]);

            // not in bounds or different letter -> part of perimeter
            // for the perimeter, the key also takes into account direction [di, dj]
            if (!isInBounds(i2, j2) || grid[i][j] !== grid[i2][j2]) {
                perimeter.add(JSON.stringify([[i2, j2], [di, dj]]));
                continue;
            } 
            
            // same letter but not yet visited -> add to queue
            if (!visited.has(posKey)) {
                visited.add(posKey);
                queue.push([i2, j2]);
            }
        }
    }
    // area is the amount of newly added visited nodes after the BFS loop
    const area = visited.size - beginningSize;
    const numSides = findSides(perimeter);

    return [area * perimeter.size, area * numSides];
}

function findSides(perimeter: Set<string>): number {
    let sides = 0;

    // can contain points outside the grid (as the set contains perimeter points and dirs)
    // whereas "visited" only contains points inside the grid
    let seen = new Set<string>();

    perimeter.forEach((key) => {
        if (seen.has(key))
            return;

        const [[i, j], [di, dj]] = JSON.parse(key);

        for (const perpendicularDir of [[dj, -di], [-dj, di]]) {
            let newKey: string = key;
            let i2 = i, j2 = j;
            const [di2, dj2] = perpendicularDir;

            // if any points lie perpendicularly to this point and direction, they are on the same side
            //
            // we do this by going in each perpendicular direction
            // until we hit a point not on the perimeter anymore.
            //
            // we add any points we find (on the perimeter) to the "seen" set 
            // so we don't count them as a new side in further iterations of the forEach loop
            while (perimeter.has(newKey)) {
                seen.add(newKey);
                i2 += di2;
                j2 += dj2;
                newKey = JSON.stringify([[i2, j2], [di, dj]]);
            }
        }
        sides++;
    });

    return sides;
}

let visited = new Set<string>();
let part1 = 0, part2 = 0;

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        const [p1Price, p2Price] = bfs(i, j);
        part1 += p1Price;
        part2 += p2Price;
    }
}

console.log(`Part 1: ${part1}`); // 1361494
console.log(`Part 2: ${part2}`); // 830516