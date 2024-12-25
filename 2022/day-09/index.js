const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

let input = inputArray('input.txt').map(x => x.split(' '));

function tailIsAdjacent(head, tail) {
    return Math.abs(tail.x - head.x) <= 1 && Math.abs(tail.y - head.y) <= 1;
}
let coveredPart1 = {};

let head = {x: 0, y: 0};
let tail = {x: 0, y: 0};
for (let i = 0; i < input.length; i++) {
    let direction = input[i][0], magnitude = parseInt(input[i][1]);
    
    for (let j = 0; j < magnitude; j++) {
        let prevHead = {x: head.x, y: head.y};
        if (direction == 'R') head.x++;
        else if (direction == 'L') head.x--;
        else if (direction == 'U') head.y++;
        else head.y--;
        
        if (!tailIsAdjacent(head, tail))  {
            tail.x = prevHead.x;
            tail.y = prevHead.y;
        }
        coveredPart1[tail.x+","+tail.y] = 1;
    }
}

/* PART 2 */ 
let knots = new Array(10);
for (let i = 0; i < knots.length; i++) 
    knots[i] = {x: 0, y:0};

let coveredPart2 = {};

function getKnotMove(knot1, knot2) {
    // Assumes the two knots are not adjacent

    // Check same row/col first
    for (let i = -1; i <= 1; i+= 2) {
        let horizontalChange = {x: knot2.x+i, y: knot2.y}
        let verticalChange   = {x: knot2.x, y: knot2.y+i}
        if (tailIsAdjacent(knot1, horizontalChange) && knot2.y == knot1.y) 
            return horizontalChange;
        else if (tailIsAdjacent(knot1, verticalChange) && knot2.x == knot1.x) 
            return verticalChange;
    }
    // Then check diagonals
    let diags = {
        topLeft: {x: knot2.x-1, y: knot2.y+1},
        topRight: {x: knot2.x+1, y: knot2.y+1},
        botLeft: {x: knot2.x-1, y: knot2.y-1},
        botRight: {x: knot2.x+1, y: knot2.y-1}
    }

    for (let pos in diags) {
        if (tailIsAdjacent(knot1, diags[pos])) 
            return diags[pos];   
    }
    return;
}

function simulateMove(direction, magnitude) {
    for (let j = 0; j < magnitude; j++) {
        if (direction == 'R') knots[0].x++;
        else if (direction == 'L') knots[0].x--;
        else if (direction == 'U') knots[0].y++;
        else knots[0].y--;

        for (let k = 0; k < knots.length - 1; k++) {
            if (!tailIsAdjacent(knots[k], knots[k+1]))  {
                let newKnot = getKnotMove(knots[k], knots[k+1]);
                knots[k+1].x = newKnot.x;
                knots[k+1].y = newKnot.y;
            }
        }
        let lastKnot = knots[knots.length-1];
        coveredPart2[lastKnot.x+","+lastKnot.y] = 1;
    }
}

for (let i = 0; i < input.length; i++) {
    let direction = input[i][0], magnitude = parseInt(input[i][1]);
    simulateMove(direction, magnitude)
}

// Today took me way too long...
console.log(`Part 1: ${Object.keys(coveredPart1).length}`);
console.log(`Part 2: ${Object.keys(coveredPart2).length}`);