const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const input = inputArray('input.txt').map(line => line.split(' -> '));
const SAND_START = [500, 0];
let maxY = 0;

function initialiseRocks() {
    let occupied = {};
    input.forEach(path => {
        for (let i = 0; i < path.length-1; i++) {
            let a = path[i].split(',').map(Number);
            let b = path[i+1].split(',').map(Number);
    
            if (a[0] == b[0]) {
                let yVals = Array.from(new Array(Math.abs(a[1] - b[1])+1), (x, i) => i + Math.min(a[1], b[1]))
                yVals.forEach(y => occupied[a[0] + ',' + y] = 1);
            } else {
                let xVals = Array.from(new Array(Math.abs(a[0] - b[0])+1), (x, i) => i + Math.min(a[0], b[0]))
                xVals.forEach(x => occupied[x + ',' + a[1]] = 1);
            }
    
            if (a[1] > maxY) maxY = a[1];
            if (b[1] > maxY) maxY = b[1];
        }
    });
    return occupied;
}

function isMovable(sandPos) {
    let [x, y] = sandPos;
    return occupied[(x-1)+ ',' +(y+1)] != 1 || 
        occupied[x+ ',' +(y+1)] != 1 ||
        occupied[(x+1)+ ',' +(y+1)] != 1;
}

function moveSand(sandPos, floor=false) {
    let [x, y] = sandPos;
    if (isMovable(sandPos)) {
        // Falling into the void
        if (!floor && y > maxY)
            return false;

        // Hitting the floor
        if (floor && y == floorY - 1) {
            occupied[sandPos] = 1;
            return true;
        }

        // Down 1
        if (occupied[x + ',' +(y+1)] != 1)
            return moveSand([x, y+1], floor);

        // Left 1, Down 1
        if (occupied[(x-1) + ',' +(y+1)] != 1)
            return moveSand([x-1, y+1], floor);
        
        // Right 1, Down 1
        if (occupied[(x+1) + ',' +(y+1)] != 1)
            return moveSand([x+1, y+1], floor);
    }
    // Reached starting point
    if (x == SAND_START[0] && y == SAND_START[1]) {
        return false;
    }
    // No more moves, place the sand
    occupied[sandPos] = 1;
    return true;
}

let sandsP1 = 0;
let occupied = initialiseRocks();
while (moveSand(SAND_START)) {
    sandsP1++;
}

let sandsP2 = 1;                // count the final unit of sand at the start 
let floorY = maxY + 2;
occupied = initialiseRocks();   // reset occupied spaces from part 1
while (moveSand(SAND_START, floor=true)) {
    sandsP2++;
}

console.log(`Part 1: ${sandsP1}`)
console.log(`Part 2: ${sandsP2}`)