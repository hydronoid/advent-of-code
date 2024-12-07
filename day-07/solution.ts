import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let part1 = 0, part2 = 0;

data.forEach((line: string) => {
    let [lhs, rhs]: string[] = line.split(': ');
    let testVal: number = parseInt(lhs);
    let rhsVals: number[] = rhs.split(" ").map(Number);

    if (findSolution(testVal, rhsVals, ['+', '*']))
        part1 += testVal;
    
    if (findSolution(testVal, rhsVals, ['+', '*', '||']))
        part2 += testVal;
});

function generateOperatorPermutations(numOperators: number, operators: string[]): string[][] {
    let permutations: string[][] = [];

    // recursively populate the permutations array
    // e.g. for 2 operators, permutations will be: [['+', '+'], ['+', '*'], ['*', '+'], ['*', '*']]
    function generatePermutations(i: number, currPermutation: string[]): void {
        if (i === numOperators) {
            // base case -> finished populating a permutation
            permutations.push([...currPermutation]);
            return;
        }

        for (const operator of operators) {
            currPermutation.push(operator);
            generatePermutations(i+1, currPermutation);
            currPermutation.pop();
        }
    }
    generatePermutations(0, []);

    return permutations;
}

function findSolution(testVal: number, rhsVals: number[], operators: string[]): boolean {
    let operatorPermutations: string[][] = generateOperatorPermutations(rhsVals.length - 1, operators);

    // brute force every permutation :)
    for (const permutation of operatorPermutations) {
        let result = rhsVals[0];

        // evaluate left-to-right
        for (let i = 1; i < rhsVals.length; i++) {
            if (permutation[i-1] === '+')
                result += rhsVals[i];
            else if (permutation[i-1] === '*')
                result *= rhsVals[i];
            else if (permutation[i-1] === '||')
                result = parseInt(result.toString() + rhsVals[i].toString());

            if (result > testVal)
                break;
        }

        if (result === testVal)
            return true;
    }

    return false;
}

console.log(`Part 1: ${part1}`); // 3245122495150
console.log(`Part 2: ${part2}`); // 105517128211543