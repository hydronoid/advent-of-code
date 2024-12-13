import { readInputToString } from '../input-utils';
import { lusolve } from 'mathjs';

const data = readInputToString('input.txt')
    .split("\r\n\r\n")
    .map(x => x.split("\r\n"));

type Coordinate = {
    x: number;
    y: number;
};

type Machine = {
    btnA: Coordinate;
    btnB: Coordinate;
    prize: Coordinate;
};

function isInteger(value: number): boolean {
    return Math.abs(value - Math.round(value)) < 1e-4;
}

function calculateTokenCost(prizeOffset: number) {
    let cost = 0;
    for (const machineLines of data) {
        const nums = machineLines.map(str => str.match(/\d+/g)?.map(num => parseInt(num)) ?? []);
        const m: Machine = {
            btnA: { x: nums[0][0], y: nums[0][1] },
            btnB: { x: nums[1][0], y: nums[1][1] },
            prize: { x: nums[2][0], y: nums[2][1] }
        };
    
        const coefficients: number[][] = [
            [m.btnA.x, m.btnB.x],
            [m.btnA.y, m.btnB.y]
        ];
        const constants: number[] = [
            m.prize.x + prizeOffset,
            m.prize.y + prizeOffset,
        ];
    
        // just solve the system of linear equations :)
        const [APresses, BPresses] = lusolve(coefficients, constants).map(row => row[0]);
    
        // solution exists if the floats are close enough to the integer values
        // e.g. 25.0004
        // for part 2 the difference goes down to 1e-4
        if (isInteger(APresses) && isInteger(BPresses))
            cost += 3 * Math.round(APresses) + Math.round(BPresses);
    }
    
    return cost;
}

console.log(`Part 1: ${calculateTokenCost(0)}`);                // 36758
console.log(`Part 2: ${calculateTokenCost(10000000000000)}`);   // 76358113886726