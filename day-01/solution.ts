import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let leftList:  number[] = [];
let rightList: number[] = [];
let rightCounter = new Map<number, number>();

// Parse each line of the data, putting the left and right numbers in separate arrays
data.forEach((line: string) => {
    // Split each line by spaces, and convert the result to the corresponding two integers
    const [leftNum, rightNum]: number[] = line.split(/\s+/).map(Number);
    leftList.push(leftNum);
    rightList.push(rightNum);

    // For part 2: count occurrences of the right numbers using a Map
    rightCounter.set(rightNum, (rightCounter.get(rightNum) || 0) + 1);
});

// Sort both lists in ascending order
leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

let totalDistance = 0;
let totalSimilarityScore = 0;

leftList.forEach((leftVal: number, i: number) => {
    totalDistance += Math.abs(leftVal - rightList[i]);
    totalSimilarityScore += leftVal * (rightCounter.get(leftVal) || 0);
});

console.log(`Part 1: ${totalDistance}`);        // 2192892
console.log(`Part 2: ${totalSimilarityScore}`); // 22962826