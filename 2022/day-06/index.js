const fs = require('fs');
const signal = fs.readFileSync('input.txt', 'utf-8');

function findMarker(signal, sequenceLength) {
    for (let i = 0; i < signal.length; i++) {
        let charSet = new Set(signal.slice(i, i+sequenceLength));
        if (charSet.size == sequenceLength)
            return i + sequenceLength;
    }
}

console.log(`Part 1: ${findMarker(signal, 4)}`);
console.log(`Part 2: ${findMarker(signal, 14)}`);