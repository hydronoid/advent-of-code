const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r\n\r\n/);
}

let input = inputArray('input.txt').map(x => x.split(/\r\n/))

function parseInput() {
    let monkeys = {};
    for (let i = 0; i < input.length; i++) {
        let monkeyLines = input[i];
        monkeys[i] = {
            startItems:  monkeyLines[1].replace('  Starting items: ', '').split(', ').map(Number),
            operation:   monkeyLines[2].split(' = ')[1],
            divisor:     parseInt(monkeyLines[3].replace('  Test: divisible by ', '')),
            throwT:      monkeyLines[4][monkeyLines[4].length - 1], 
            throwF:      monkeyLines[5][monkeyLines[5].length - 1],
            inspections: 0
        };
    }
    return monkeys;
}

function solution(rounds, divBy3) {
    let monkeys = parseInput();
    const BIG_DIVISOR = Object.keys(monkeys)
                        .map(monkeyNo => monkeys[monkeyNo].divisor)
                        .reduce((a, b) => (a * b));

    for (let i = 0; i < rounds; i++) {
        for (let monkeyNo in monkeys) {
            let monkey = monkeys[monkeyNo];
            while (monkey.startItems.length > 0) {
                monkey.inspections++;
                let old = monkey.startItems.shift(); // for use in eval()
                let newLevel = divBy3 ? Math.floor(eval(monkey.operation) / 3) : eval(monkey.operation) % BIG_DIVISOR;

                monkeys[(newLevel % monkey.divisor == 0) ? monkey.throwT : monkey.throwF].startItems.push(newLevel);
            }
        }
    }
    let totalInspections = Object.keys(monkeys)
        .map(monkeyNo => monkeys[monkeyNo].inspections)
        .sort((a, b) => b - a);
    return totalInspections[0] * totalInspections[1]; 
}

/*
Today was the first day I had to look on the subreddit for hints (for part 2).
I knew I had to use modulo by something large (I tried 10^3, 10^4 etc. first),
but I didn't know what until I looked for hints.
*/
console.log(`Part 1: ${solution(20, divBy3=true)}`);
console.log(`Part 2: ${solution(10000, divBy3=false)}`);