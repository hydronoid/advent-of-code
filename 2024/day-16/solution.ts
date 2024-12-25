import { readInputToArray } from '../input-utils';

const grid: string[][] = readInputToArray('input.txt').map(line => line.split(''));
const directions: number[][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

const START = [grid.length - 2, 1];
const END   = [1, grid[0].length - 2];

class PriorityQueue<T> {
    private heap: { value: T; priority: number }[] = [];

    enqueue(value: T, priority: number) {
        this.heap.push({ value, priority });
        this.heap.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): T | undefined {
        return this.heap.shift()?.value;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}

// key consists of both location (i, j) and direction (di, dj)
function makeKey(i: number, j: number, di: number, dj: number): string {
    return JSON.stringify([[i, j], [di, dj]]);
}

function parseKey(key: string): number[][] {
    return JSON.parse(key);
}

function getNeighbours(i: number, j: number, di: number, dj: number, grid: string[][]): string[] {
    const possibleDirs = [
        [di, dj],   // same direction
        [dj, -di],  // 90 degree turn clockwise
        [-dj, di]   // 90 degree turn anticlockwise
    ];
    let neighbours: string[] = [];

    for (const [di2, dj2] of possibleDirs)
        if (grid[i+di2][j+dj2] !== '#')
            neighbours.push(makeKey(i+di2, j+dj2, di2, dj2));

    return neighbours;
}

// Part 1
function dijkstra(start: number[], grid: string[][]): [{ [key: string]: number }, { [key: string]: string}] {
    const distances: { [key: string]: number } = {};
    const parent: { [key: string]: string } = {};
    const pq = new PriorityQueue<string>();

    // set initial distances as infinity
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[0].length; j++)
            for (const [di, dj] of directions)
                if (grid[i][j] !== '#')
                    distances[makeKey(i,j,di,dj)] = Infinity;
    
    // initially at S, facing east: [0, 1]
    distances[makeKey(start[0], start[1], 0, 1)] = 0;
    pq.enqueue(makeKey(start[0], start[1], 0, 1), 0);

    while (!pq.isEmpty()) {
        const currentKey: string = pq.dequeue()!;
        const [[i, j], [di, dj]] = parseKey(currentKey);
        const currentDistance: number = distances[currentKey];

        for (const neighbourKey of getNeighbours(i, j, di, dj, grid)) {
            const [di2, dj2] = parseKey(neighbourKey)[1];

            // weight is 1 if we don't change direction and 1001 if we do
            const newDistance = currentDistance + (di == di2 && dj == dj2 ? 1 : 1001);
            if (newDistance < distances[neighbourKey]) {
                distances[neighbourKey] = newDistance;
                parent[neighbourKey] = currentKey;
                pq.enqueue(neighbourKey, newDistance);
            } 
        }
    }

    return [distances, parent];
}

// Part 2
function findTiles(distances: { [key: string]: number }, parent: { [key: string]: string }, end: string): number {
    // backtrack from the end via BFS
    let visited = new Set<string>();
    let queue: string[] = [end];
    
    while (queue.length > 0) {
        let currKey: string = queue.shift()!;
        let [[i, j], [di, dj]] = parseKey(currKey);
        visited.add(JSON.stringify([i, j]));

        // check every way we came to this tile via its parent
        for (const [di2, dj2] of directions) {
            if (parent[currKey] === undefined) 
                continue;

            // parent tile
            const [i2, j2] = parseKey(parent[currKey])[0];
            const parentKey = makeKey(i2, j2, di2, dj2);
            const weight = (di == di2 && dj == dj2 ? 1 : 1001);

            // if dist[u] + weight = dist[v], then the parent tile and dir are part of a best path
            if (distances[parentKey] + weight === distances[currKey])
                queue.push(parentKey);
        }
    }
    return visited.size;
}

const [dists, parents] = dijkstra(START, grid);
const endKey: string = Object.keys(dists)
    .filter(key => key.includes(JSON.stringify(END)))
    .reduce((smallest, key) => dists[key] < dists[smallest] ? key : smallest);

// spent too much time debugging part 2 today :S

console.log(`Part 1: ${dists[endKey]}`);                        // 72428
console.log(`Part 2: ${findTiles(dists, parents, endKey)}`);    // 456
