import { readInputToString } from '../input-utils';

let data: string = readInputToString('input.txt');

// Part 1
const mul = (a: number, b: number): number => a * b; // function for eval
let part1 = 0;

const mulRegex: RegExp = /mul\(?(\d+),?(\d*)\)/g;
const mulMatches: string[] = data.match(mulRegex) || [];

// Apply eval to each match of mul(a,b), and sum
part1 = mulMatches.map((instruction: string) => eval(instruction))
    .reduce((acc, value) => acc + value, 0);

// Part 2
const combinedRegex: RegExp = /(mul\((\d+),(\d+)\)|do(n't)?\(\))/g;
let part2 = 0;
let instructions: string[] = data.match(combinedRegex) || [];

let mulEnabled = true;
for (const instruction of instructions) {
    if (instruction == "do()")
        mulEnabled = true;
    else if (instruction == "don't()")
        mulEnabled = false;
    else 
        part2 += mulEnabled ? eval(instruction) : 0;
}

console.log(`Part 1: ${part1}`); // 178794710
console.log(`Part 2: ${part2}`); // 76729637