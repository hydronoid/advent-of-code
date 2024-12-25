const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const DECRYPTION_KEY = 811589153;
const input = inputArray('input.txt').map(Number);
const decryptedInput = input.map(x => x * DECRYPTION_KEY);

let mixedP1 = Array.from(new Array(input.length), (x, i) => i);
let mixedP2 = Array.from(new Array(input.length), (x, i) => i)

let len = input.length;


function moveNumber(origIdx, places, mixedArr) {
    let currPos = mixedArr.indexOf(origIdx);
    mixedArr.splice(currPos, 1);

    // it takes len-1 moves to get back to the same position
    let newPos = mod(currPos + places, len - 1);
    mixedArr.splice(newPos, 0, origIdx);
}

function mod(a, b) {return ((a % b) + b) % b;}

function groveCoordSum(mixedArr, orig) {
    let mixedVals = mixedArr.map(idx => orig[idx])
    let zeroPos = mixedVals.indexOf(0);
    return mixedVals[(zeroPos + 1000) % len]
        + mixedVals[(zeroPos + 2000) % len]
        + mixedVals[(zeroPos + 3000) % len];
}

input.forEach((val, idx) => moveNumber(idx, val, mixedP1));

for (let n = 0; n < 10; n++) {
    decryptedInput.forEach((val, idx) => moveNumber(idx, val, mixedP2));
}

console.log(`Part 1: ${groveCoordSum(mixedP1, input)}`);
console.log(`Part 2: ${groveCoordSum(mixedP2, decryptedInput)}`);