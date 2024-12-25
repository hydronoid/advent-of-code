import { readInputToString } from '../input-utils';

const [p1Grid, moves] = readInputToString('input.txt')
    .split("\r\n\r\n")
    .map(x => x.split("\r\n").map(line => line.split('')));

let robotPosP1: number[] = [-1, -1];
let robotPosP2: number[] = [-1, -1];
let moveDirMap: { [key: string]: number[] } = {
    '^': [-1, 0],
    'v': [1,  0],
    '<': [0, -1],
    '>': [0,  1],
};

let p2Grid: string[][] = [];

for (let i = 0; i < p1Grid.length; i++) {
    p2Grid.push([]);
    for (let j = 0; j < p1Grid[0].length; j++) {
        if (p1Grid[i][j] === '#') {
            p2Grid[i].push('#', '#');
        } else if (p1Grid[i][j] === 'O') {
            p2Grid[i].push('[', ']');
        } else if (p1Grid[i][j] === '.') {
            p2Grid[i].push('.', '.');
        } else if (p1Grid[i][j] === '@') {
            robotPosP1 = [i, j];
            robotPosP2 = [i, j*2];
            p2Grid[i].push('@', '.');
        }
    }
}

// helper function to visualise the current grid
function printGrid(grid: string[][]): void {
    grid.forEach((line) => console.log(line.join('')));
}

function moveRobotP1(pos: number[], move: string, grid: string[][]): number[] {
    const [i, j] = pos;
    const [di, dj] = moveDirMap[move];
    const [i2, j2] = [i+di, j+dj];

    switch (grid[i2][j2]) {
        case '.':
            grid[i][j] = '.';
            return [i2, j2];
        case '#':
            // hit a wall -> nothing happens
            return pos;
        case 'O':
            let [i3, j3] = [i2, j2];

            // keep moving until we don't see a box anymore
            while (grid[i3][j3] === 'O') {
                i3 += di;
                j3 += dj;
            }

            // free space found
            if (grid[i3][j3] === '.') {
                grid[i][j] = '.';
                grid[i2][j2] = '@';
                grid[i3][j3] = 'O';
                return [i2, j2];
            }

            // hit a wall -> nothing happens
            return pos;
    }
    return [-1, -1];
}

function findMovableBoxes(leftBracketPos: number[], move: string, p2Grid: string[][]): number[][] {
    let movableBoxes: number[][] = []; // if this ever contains an empty array, it means we can't move
    let [i, j] = leftBracketPos;
    const [di, dj] = moveDirMap[move];

    if (move === '>' || move === '<') {
        // left/right logic
        // keep going in the direction to find left brackets and add them to the list
        while (p2Grid[i][j] === '[' || p2Grid[i][j] === ']') {
            if (p2Grid[i][j] === '[')
                movableBoxes.push([i, j]);
            j += dj;
        }
        return p2Grid[i][j] === '.' ? movableBoxes : [[]];
    } else {
        // up/down logic
        const nextL = p2Grid[i+di][j];
        const nextR = p2Grid[i+di][j+1];

        // wall hit -> cannot move
        if (nextL === '#' || nextR === '#')
            return [[]];

        movableBoxes.push([i, j]);

        // recursively find boxes that will be affected

        // box 1: above/below the left bracket is a right bracket
        // []. <-- like this (if moving up from the bottom box)
        // .[]
        if (nextL === ']')
            movableBoxes = movableBoxes.concat(findMovableBoxes([i+di, j-1], move, p2Grid));

        // box 2: : above/below the right bracket is a left bracket
        // .[] <-- like this (if moving up from the bottom box)
        // [].
        if (nextR === '[')
            movableBoxes = movableBoxes.concat(findMovableBoxes([i+di, j+1], move, p2Grid));

        // only one box (aligned with the current box), e.g.
        // ..[]..
        // ..[]..
        if (nextL === '[' && nextR === ']')
            movableBoxes = movableBoxes.concat(findMovableBoxes([i+di, j], move, p2Grid));

        return movableBoxes.some(coords => coords.length === 0) ? [[]] : movableBoxes;
    }
}

function moveRobotP2(pos: number[], move: string, p2Grid: string[][]): number[] {
    const [i, j] = pos;
    const [di, dj] = moveDirMap[move];
    const [i2, j2] = [i+di, j+dj];
    let movableBoxes: number[][];

    switch (p2Grid[i2][j2]) {
        case '.':
            p2Grid[i][j] = '.';
            p2Grid[i2][j2] = '@';
            return [i2, j2];
        case '#':
            return pos;
        case '[':
        case ']':
            // coordinates of a box will always be of the left bracket: [
            const rightBracketOffset = (p2Grid[i2][j2] === ']') ? -1 : 0;
            movableBoxes = findMovableBoxes([i2, j2 + rightBracketOffset], move, p2Grid);

            // if box coordinates are all >0 in length (i.e. no empty ones), we have a valid move
            if (movableBoxes.every(coords => coords.length > 0)) {
                // replace all the original positions with empty spaces
                for (const [boxI, boxJ] of movableBoxes) {
                    p2Grid[boxI][boxJ] = '.';
                    p2Grid[boxI][boxJ+1] = '.';
                }

                // then move the boxes to their new positions
                for (const [boxI, boxJ] of movableBoxes) {
                    p2Grid[boxI+di][boxJ+dj] = '[';
                    p2Grid[boxI+di][boxJ+dj+1] = ']';
                }

                // and move the robot
                p2Grid[i][j] = '.';
                p2Grid[i2][j2] = '@';

                return [i2, j2];
            }
            // otherwise do nothing
            return pos;
    }

    return [-1, -1];
}

function calculateGPSCoordinateSum(grid: string[][], boxChar: string): number {
    let coordinateSum = 0;
    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[0].length; j++)
            if (grid[i][j] === boxChar)
                coordinateSum += 100 * i + j;
    return coordinateSum;
}

for (const line of moves) {
    for (const move of line) {
        robotPosP1 = moveRobotP1(robotPosP1, move, p1Grid);
        robotPosP2 = moveRobotP2(robotPosP2, move, p2Grid);
    }
}

// struggled a lot with part 2 today, especially debugging
// code is probably super messy and could be improved a lot

console.log(`Part 1: ${calculateGPSCoordinateSum(p1Grid, 'O')}`);   // 1515788
console.log(`Part 2: ${calculateGPSCoordinateSum(p2Grid, '[')}`);   // 1516544