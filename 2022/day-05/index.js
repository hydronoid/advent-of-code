const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

let arr = inputArray('input.txt');

// Initialise stacks
let numStacks = Math.floor(arr[0].length / 3);
let stacksP1 = new Array(numStacks);
let stacksP2 = new Array(numStacks);
for (let i = 0; i < numStacks; i++)  {
    stacksP1[i] = new Array();
    stacksP2[i] = new Array();
}

let processingStacks = true;
for (let i = 0; i < arr.length; i++) {
    if (arr[i] == '')  {
        processingStacks = false;
        continue;
    }
    if (processingStacks) {
        // Populate the stacks
        for (let j = 1; j < arr[i].length; j += 4) {
            let stackNo = (j-1) / 4;
            if (arr[i][j] == ' ') continue;
            stacksP1[stackNo].push(arr[i][j]);
            stacksP2[stackNo].push(arr[i][j]);
        }
    } else {
        // Process the moves
        let moves = arr[i]
            .replace(/(move )|(to )|(from )/g, '')
            .split(' ')
            .map(Number); // move [0] from [1] to [2]

        let source = moves[1] - 1, destination = moves[2] - 1;
        for (let j = 0; j < moves[0]; j++) {
            stacksP1[destination].unshift(stacksP1[source].shift());
            stacksP2[destination].splice(j, 0, stacksP2[source].shift());
        }
    }
}

console.log(`Part 1: ${stacksP1.map((x)=>x[0]).join('')}`);
console.log(`Part 2: ${stacksP2.map((x)=>x[0]).join('')}`);