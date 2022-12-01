const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/).map(Number);
}

function part1(filename) {
    let arr = inputArray(filename);
    let maxCalories = Number.MIN_SAFE_INTEGER;
    let currentCalories = 0;
    for (let i = 0; i < arr.length; i++) {
        
        
        if (arr[i] == 0) currentCalories = 0;
        currentCalories += arr[i];
        if (currentCalories > maxCalories) {
            maxCalories = currentCalories;
        }
    }
    return maxCalories;
}

function part2(filename) {
    let arr = inputArray(filename);
    let elfArr = [];
    let currentCalories = 0;
    for (let i = 0; i < arr.length; i++) {
        currentCalories += arr[i];
        if (arr[i] == 0)  {
            elfArr.push(currentCalories);
            currentCalories = 0;
        }
    }
    elfArr.push(currentCalories);
    elfArr.sort((a, b) => b - a);
    return elfArr[0] + elfArr[1] + elfArr[2];

}

console.log(part1('sample.txt'));
console.log(part2('sample.txt'));


console.log(part1('input.txt'));
console.log(part2('input.txt'));
