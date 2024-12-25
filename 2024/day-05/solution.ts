import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let ruleMap: { [key: number]: number[] } = {}; // key: preceding number, value: list of numbers allowed to come after it
let part1 = 0, part2 = 0;

let processingRules = true;
data.forEach((line: string) => {
    if (line === '') {
        // the empty line in the input means we have finished processing page ordering rules
        processingRules = false;
        return;
    }
    
    if (processingRules) {
        let [precedingNum, succeedingNum]: number[] = line.split('|').map(Number);

        if (!ruleMap[precedingNum])
            ruleMap[precedingNum] = [];

        ruleMap[precedingNum].push(succeedingNum);
    } else {
        let update: number[] = line.split(',').map(Number);
        let middlePgNumber: number = update[Math.floor(update.length / 2)];
        if (isInOrder(update)) {
            part1 += middlePgNumber;
        } else {
            while (!isInOrder(update)) {
                // keep swapping positions of pages until they are in order :)
            }
            middlePgNumber = update[Math.floor(update.length / 2)];
            part2 += middlePgNumber;
        }
    }
});

function isInOrder(update: number[]): boolean {
    for (let i = 0; i < update.length-1; i++) {
        for (let j = i+1; j < update.length; j++) {;
            // the number may not exist in the rule map -> just continue with the loop
            if (!ruleMap[update[j]])
                continue;

            // if the number at position j includes position i in its rules,
            // it's out of order, since j comes after i
            if (ruleMap[update[j]].includes(update[i])) {
                // for part 2, swap their positions if they are out of order
                [update[i], update[j]] = [update[j], update[i]]
                return false;
            }
        }
    }
    return true;
}

console.log(`Part 1: ${part1}`); // 5275
console.log(`Part 2: ${part2}`); // 6191