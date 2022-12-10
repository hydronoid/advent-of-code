const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const input = inputArray('input.txt');
var register = 1, cycle = 1;
var signalStrengths = [];

var crtRows = new Array(6);
for (let i=0; i<crtRows.length; i++) crtRows[i] = '';

function checkCycle() {
    if ((cycle + 20) % 40 == 0)
        signalStrengths.push(cycle * register);
    crtRows[Math.floor((cycle-1) / 40)] += Math.abs(register - ((cycle-1) % 40)) <= 1 ? '#' : '.';
}

input.forEach(line => {
    checkCycle();
    if (line != 'noop') {
        cycle++;
        checkCycle();
        register += parseInt(line.split(' ')[1]);
    }
    cycle++;
});

console.log(`Part 1: ${signalStrengths.reduce((a, b) => a + b)}`);
console.log(`Part 2:`);
crtRows.forEach(line => console.log(line));