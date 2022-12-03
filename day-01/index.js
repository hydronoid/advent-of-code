const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/).map(Number);
}

let arr = inputArray('input.txt');
let elfArr = [];
let currentCalories = 0;
for (let i = 0; i < arr.length; i++) {
    currentCalories += arr[i];
    if (arr[i] == 0)  {
        elfArr.push(currentCalories);
        currentCalories = 0;
    }
}
elfArr.sort((a, b) => b - a);

console.log("Part 1: ", elfArr[0]);
console.log("Part 2: ", elfArr[0] + elfArr[1] + elfArr[2]);