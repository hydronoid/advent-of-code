import { readInputToString } from '../input-utils';

const data = readInputToString('input.txt')

const regex = /Register A:\s*(\d+)\s*Register B:\s*(\d+)\s*Register C:\s*(\d+)\s*Program:\s*([\d,]+)/;

const match = data.match(regex)!;

let a: bigint = BigInt(match[1]);
let b: bigint = BigInt(match[2]);
let c: bigint = BigInt(match[3]);

const program = match[4].split(',').map(Number);
const programStr = match[4];

function combo(n: bigint): bigint {
    if (n <= 3n) return n;
    else if (n === 4n) return a;
    else if (n === 5n) return b;
    else if (n === 6n) return c;
    return -1n;
}

function executeInstruction(opCode: number, operand: bigint, instructionPtr: number, outNums: number[]): number {
    let ptrIncrease = 2;

    switch (opCode) {
        case 0:
            a = a / 2n ** combo(operand);
            break;
        case 1:
            b = b ^ operand; 
            break;
        case 2:
            b = combo(operand) % 8n;
            break;
        case 3:
            if (a !== 0n)
                ptrIncrease = Number(operand) - instructionPtr; 
            break;
        case 4:
            b = b ^ c;
            break;
        case 5:
            outNums.push(Number(combo(operand) % 8n));
            break;
        case 6:
            b = a / 2n ** combo(operand);
            break;
        case 7:
            c = a / 2n ** combo(operand);
            break;
        default:
            break;
    }
    return ptrIncrease;
}

// Part 1
function runProgram(aInit: bigint): string {
    a = aInit;
    let instructionPtr = 0;
    let outNums: number[] = [];
    
    while (instructionPtr < program.length) {
        const [opCode, operand] = program.slice(instructionPtr, instructionPtr+2);
        instructionPtr += executeInstruction(opCode, BigInt(operand), instructionPtr, outNums);
    }
    return outNums.map(String).join(',');
}

// Part 2
function dfs(octalStr: string): number {
    if (octalStr.length === program.length) {
        const programOutput = runProgram(BigInt(parseInt(octalStr, 8)));
        if (programOutput === programStr)
            return parseInt(octalStr, 8);
        return -1;
    }

    for (const digit of "01234567") {
        const newOctalStr = octalStr + digit;
        const programOutput = runProgram(BigInt(parseInt(newOctalStr, 8)));

        // octal string length n corresponds to the amount of numbers in the program output
        // this if statement checks if the generated output matches the last n numbers in the target output (programStr)
        if (programOutput === programStr.split(',').slice(-newOctalStr.length).join(',')) {
            const result = dfs(newOctalStr);
            if (result !== -1)
                return result;
        }
    }
    return -1;
}

// struggled a lot with part 2 today, again. I knew that there had to be some pattern with a
// and I initially observed the property of powers of 8 increasing output length
// but past that, it took me way too long even with hints to figure out that the first
// octal digit corresponded to the LAST program output digit (thought it was first to first for the longest time)
// and I had lots of issues with trying to make BigInt work with my janky typescript environment

console.log(`Part 1: ${runProgram(a)}`);    // 7,6,1,5,3,1,4,2,6
console.log(`Part 2: ${dfs('')}`);          // 164541017976509
