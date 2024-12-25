import { readInputToString } from '../input-utils';

const data = readInputToString('input.txt')
    .split('\r\n\r\n')
    .map(str => str.split("\r\n"));

function getHeights(schematic: string[]): number[] {
    const heights: number[] = [];
    for (let col = 0; col < schematic[0].length; col++) {
        let currHeight = 0;
        for (let row = 1; row < schematic.length - 1; row++) {
            if (schematic[row][col] === '#') {
                currHeight++;
            }
        }
        heights.push(currHeight);
    }
    return heights;
}

function keyFitsLock(key: number[], lock: number[]): boolean {
    for (let i = 0; i < key.length; i++)
        if (key[i] + lock[i] > 5)
            return false;
    return true;
}

const keys:  number[][] = [];
const locks: number[][] = [];

for (const schematic of data) {
    if (schematic[0] === "#####")
        locks.push(getHeights(schematic));
    else
        keys.push(getHeights(schematic));
}

let part1 = 0;
for (const key of keys)
    for (const lock of locks)
        if (keyFitsLock(key, lock))
            part1++;

console.log(`Part 1: ${part1}`);