import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let part1 = 0, part2 = 0;

data.forEach((line: string) => {
    let [lhs, rhs]: string[] = line.split(': ');
    let testVal: number = parseInt(lhs);
    let rhsVals: number[] = rhs.split(" ").map(Number);

    if (findSolution(testVal, rhsVals, ['+', '*'], rhsVals[0], 1))
        part1 += testVal;
    
    if (findSolution(testVal, rhsVals, ['+', '*', '||'], rhsVals[0], 1))
        part2 += testVal;
});

// recursively try all operator combinations
function findSolution(testVal: number, rhsVals: number[], operators: string[], currentResult: number, i: number): boolean {
    // base case - reached the end of the rhsVals
    if (i === rhsVals.length)
        return currentResult === testVal;
    
    // this cuts down the time in half
    if (currentResult > testVal)
        return false;
    
    let solutions: boolean[] = [];

    for (const operator of operators) {
        if (operator === '+') 
            solutions.push(findSolution(testVal, rhsVals, operators, currentResult + rhsVals[i], i+1));
        else if (operator === '*') 
            solutions.push(findSolution(testVal, rhsVals, operators, currentResult * rhsVals[i], i+1));
        else if (operator === '||') 
            solutions.push(findSolution(testVal, rhsVals, operators, parseInt(`${currentResult}${rhsVals[i]}`), i+1));
    }

    // true if any of elements of solutions are true
    return solutions.some(Boolean);
}

console.log(`Part 1: ${part1}`); // 3245122495150
console.log(`Part 2: ${part2}`); // 105517128211543