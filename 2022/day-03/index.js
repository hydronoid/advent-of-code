const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

var priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let arr = inputArray('input.txt');

function findPriority(c1, c2, c3) {
    let cLength = c1.length;
    for (let i = 0; i < cLength; i++) 
        if (c2.indexOf(c1[i]) != -1 && (c3 ? c3.indexOf(c1[i]) != -1 : true)) 
            return priorities.indexOf(c1[i]) + 1;
    return 0;
}

let prioritySum = 0;
for (let i = 0; i < arr.length; i++) {
    let compartment1 = arr[i].slice(0, arr[i].length / 2);
    let compartment2 = arr[i].slice(arr[i].length / 2);
    prioritySum += findPriority(compartment1, compartment2, null);
}
console.log("Part 1: " + prioritySum);


prioritySum = 0;
for (let i = 0; i < arr.length; i += 3) {
    prioritySum += findPriority(arr[i], arr[i+1], arr[i+2]);
}
console.log("Part 2: " + prioritySum);

