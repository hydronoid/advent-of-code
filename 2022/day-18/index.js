const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

let input = inputArray('input.txt').map(x => x.split(',').map(Number));
console.log(input)
let sides = {};
input.forEach(cube => sides[cube] = 6);

function isConnected(cubeA, cubeB) {
    let [x1, y1, z1] = cubeA;
    let [x2, y2, z2] = cubeB;
    if (x1 == x2) {
        return y1 == y2 && Math.abs(z1 - z2) <= 1 ||
            z1 == z2 && Math.abs(y1 - y2) <= 1;
    } 
    
    return Math.abs(x1 - x2) <= 1 && y1 == y2 && z1 == z2;
}

function adjacentCubes(cube) {
    let [x, y, z] = cube;
    return [
        [x-1, y, z], [x+1, y, z],
        [x, y-1, z], [x, y+1, z],
        [x, y, z-1], [x, y, z+1]
    ];
}

function isTrapped(cube) {
    if (sides[cube] != undefined) return false;
    let adjCubes = adjacentCubes(cube);
    for (let c of adjCubes)
        if (sides[c] == undefined)
            return false;
    return true;
}

let interior = {};
for (let i = 0; i < input.length; i++) {
    let cubeA = input[i];
    for (let j = i+1; j < input.length; j++) {
        let cubeB = input[j];
        if (isConnected(cubeA, cubeB)) {
            sides[cubeA]--;
            sides[cubeB]--;
        }
    }
    let adjCubes = adjacentCubes(cubeA);
    adjCubes.forEach(cube => interior[cube] = false);
}

let n = 0;
for (let cube of Object.keys(interior)) {
    cube = cube.split(',').map(Number)
    if (isTrapped(cube)) {
        console.log(cube, 'is trapped')
        interior[cube] = true;
        n += 6;
    }
        
}
// console.log(interior)
// part 2 : could be non-1x1x1?
console.log(Object.keys(interior).filter(c => interior[c] == true))
console.log(n);
console.log(Object.values(sides).reduce((a, b) => a + b))
console.log(Object.values(sides).reduce((a, b) => a + b) - n)