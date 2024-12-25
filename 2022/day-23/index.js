const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const input = inputArray('input.txt');
let directionOrder = ['N', 'S', 'W', 'E'];
let elvePositions = {};

for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
        if (input[i][j] == '#')
            elvePositions[[i, j]] = 1;
    }
}

function proposeMove(y, x) {
    let adjPositions = {
        'W': [[y-1, x-1], [y, x-1], [y+1, x-1]], // NW, W, SW
        'E': [[y-1, x+1], [y, x+1], [y+1, x+1]], // NE, E, SE
        'N': [[y-1, x-1], [y-1, x], [y-1, x+1]], // NW, N, NE
        'S': [[y+1, x-1], [y+1, x], [y+1, x+1]], // SW, S, SE
        'all': [
            [y-1, x-1], [y-1, x], [y-1, x+1],
            [y,   x-1],           [y,   x+1],
            [y+1, x-1], [y+1, x], [y+1, x+1]
        ]
    }
    if (adjPositions['all'].every(pos => elvePositions[pos] != 1))
        return [y, x];

    for (let d of directionOrder)
        if (adjPositions[d].every(pos => elvePositions[pos] != 1))
            return adjPositions[d][1];
    return [y, x];
}

function moveElves() {
    let currentPositions = Object.keys(elvePositions).map(pos => pos.split(',').map(Number));
    let proposedMoves = [];
    for (let pos of currentPositions) {
        let [y, x] = pos;
        proposedMoves.push(proposeMove(y, x));
    }

    actualMoves = [];
    for (let a = 0; a < proposedMoves.length; a++) {
        let move = proposedMoves[a];
        if (proposedMoves.filter(pos => pos[0] == move[0] && pos[1] == move[1]).length > 1)
            move = currentPositions[a];
        actualMoves.push(move);
    }
    elvePositions = {};
    actualMoves.forEach(pos => elvePositions[pos] = 1);
    directionOrder.push(directionOrder.shift());
    
    return JSON.stringify(actualMoves) == JSON.stringify(currentPositions);
}

function emptyTiles(debug=false) {
    let n = 0;
    let currentPositions = Object.keys(elvePositions).map(pos => pos.split(',').map(Number));
    let xVals = currentPositions.map(pos => pos[0]);
    let yVals = currentPositions.map(pos => pos[1]);
    
    
    let minX = Math.min(...xVals), maxX = Math.max(...xVals);
    let minY = Math.min(...yVals), maxY = Math.max(...yVals);

    let line = '';
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (elvePositions[[x, y]] == 1) {
                line += '#';
            } else {
                line += '.';
                n++;
            }
        }
        if (debug) console.log(line);
        line = '';
    }
    return n;
}

let rounds = 1;
let part1;
while (!moveElves()) {
    if (rounds == 10) part1 = emptyTiles();
    rounds++;
}

// Takes almost a minute to do part 2...
console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${rounds}`);