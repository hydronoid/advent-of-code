const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const input = inputArray('sample.txt')
let monkeys = {};

input.forEach(line => {
    let [monkeyName, value] = line.split(': ');
    if (isNaN(parseInt(value))) {
        let [m1, operation, m2] = value.split(' ');
        monkeys[monkeyName] = {num: null, children: [m1, m2], op: operation};
    } else {
        monkeys[monkeyName] = {num: parseInt(value), children: null, operation: null};
    }
});

let [rootA, rootB] = monkeys['root'].children;
console.log(rootA, rootB)

// let test = [];
function DFS(monkeyName) {
    let currentMonkey = monkeys[monkeyName];
    // test.push(monkeyName);
    // if (monkeyName == 'humn') 
    //     console.log(test)
    if (currentMonkey.children == null)
        return currentMonkey.num;
    let [m1, m2] = currentMonkey.children;
    
    
    //console.log(test)
    // if (m1 == 'humn') console.log('m1')
    let b = DFS(m2);
    // test.pop()
    let a = DFS(m1);
    // test.pop()
    
    switch (currentMonkey.op) {
        case '+':
            currentMonkey.num = a + b;
            return a + b;
        case '-':
            currentMonkey.num = a - b;
            return a - b;
        case '*':
            currentMonkey.num = a * b;
            return a * b;
        default:
            currentMonkey.num = a / b;
            return a / b;        
    }
}

DFS('root')

console.log(`Part 1: ${monkeys['root'].num}`)
console.log(monkeys[rootA].num, monkeys[rootB].num)