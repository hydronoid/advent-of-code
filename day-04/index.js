const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

function rangeContains(r1, r2, fullyContains) {
    r1 = r1.split('-').map(Number);
    r2 = r2.split('-').map(Number);
    if (r2[0] >= r1[0] && r2[fullyContains ? 1 : 0] <= r1[1])
        return true;
    return false;
}

let arr = inputArray('input.txt');
let numContained = 0, numOverlaps = 0;
for (let i = 0; i < arr.length; i++) {
    let pairArr = arr[i].split(',');
    if (
        rangeContains(pairArr[0], pairArr[1], true) ||
        rangeContains(pairArr[1], pairArr[0], true)
    ) numContained++;

    if (
        rangeContains(pairArr[0], pairArr[1], false) ||
        rangeContains(pairArr[1], pairArr[0], false)
    ) numOverlaps++;
}

console.log(`Part 1: ${numContained}`);
console.log(`Part 2: ${numOverlaps}`);
// Today I was exactly rank #10,000 to complete part 2!