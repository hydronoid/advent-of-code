import { readInputToArray } from '../input-utils';

const data: string[] = readInputToArray('input.txt');
const WIDTH = 101;
const HEIGHT = 103;
const MIDDLE_HORIZONTAL = Math.floor(WIDTH/2);
const MIDDLE_VERTICAL = Math.floor(HEIGHT/2);

interface Point {
    x: number;
    y: number;
    }
  
interface Velocity {
    x: number;
    y: number;
}

interface Robot {
    p: Point;
    v: Velocity;
}

function parseInput(data: string[]): Robot[] {
    const regex = /p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)/;
    let robots: Robot[] = [];
    for (const line of data) {
        const match = regex.exec(line) || [];
        const pt: Point = { x: parseInt(match[1]), y: parseInt(match[2]) };
        const vel: Velocity = { x: parseInt(match[3]), y: parseInt(match[4]) };
        robots.push({p: pt, v: vel});
    }
    return robots;
}

function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

function moveRobots(robots: Robot[], seconds: number): Point[] {
    // return the robot locations after N seconds
    return robots.map(({ p, v }) => ({
        x: mod(p.x + v.x * seconds, WIDTH),
        y: mod(p.y + v.y * seconds, HEIGHT),
    }));
}

// Part 1
function calculateSafetyFactor(robotLocs: Point[]): number {
    let quadrantRobotCount = [0, 0, 0, 0];
    for (const p of robotLocs) {
        if (p.x === MIDDLE_HORIZONTAL || p.y === MIDDLE_VERTICAL)
            continue;

        const xQuadrant = (p.x < MIDDLE_HORIZONTAL) ? 0 : 1;
        const yQuadrant = (p.y < MIDDLE_VERTICAL) ? 0 : 1;
    
        quadrantRobotCount[xQuadrant*2 + yQuadrant]++;
    }

    return quadrantRobotCount.reduce((acc, num) => acc * num, 1);
}

// Part 2
function hasTree(robotLocs: Point[], printGrid: boolean): boolean {
    let grid: string[][] = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill("."));
    for (const pt of robotLocs)
        grid[pt.y][pt.x] = 'O';

    // to detect a tree, we try to detect a large enough section of consecutive vertical points
    // the threshold of 10 was chosen arbitrarily
    let maxConsecutivePts = 0;

    for (let x = 0; x < grid[0].length; x++) {
        let consecutivePts = 0;
        for (let y = 0; y < grid.length; y++) {
            consecutivePts = (grid[y][x] === 'O') ? consecutivePts + 1 : 0;
            maxConsecutivePts = Math.max(consecutivePts, maxConsecutivePts);
        }
    }

    if (maxConsecutivePts >= 10 && printGrid)
        grid.forEach((line) => console.log(line.join('')));

    return maxConsecutivePts >= 10;
}

const robots: Robot[] = parseInput(data);
const safetyFactor: number = calculateSafetyFactor(moveRobots(robots, 100));

let treeSeconds = -1;
for (let t = 0; t < WIDTH*HEIGHT; t++)
    // change to true if you want to print the tree
    if (hasTree(moveRobots(robots, t), false))
        treeSeconds = t;

// Struggled with part 2 today because it was not clear what the tree would look like in the output,
// so I looked on the subreddit for hints. e.g. I thought it would look something like this:
//
//         O
//        O_O
//       O___O
//      O_____O
//     O_______O
//    O_________O
//   O___________O
//  OOOOOOO_OOOOOOO
//        O_O
//        OOO
//
// and some other assumptions I made, like every single point would be part of the tree,
// or the grid would be entirely symmetrical

console.log(`Part 1: ${safetyFactor}`);     // 231852216
console.log(`Part 2: ${treeSeconds}`);      // 8159