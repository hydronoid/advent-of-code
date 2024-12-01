import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let leftList:  number[] = [];
let rightList: number[] = [];
let rightCounter = new Map<number, number>();

// Parse each line of the data, putting the left and right numbers in separate arrays
data.forEach((line: string) => {
    const [leftNum, rightNum]: number[] = line.split(/\s+/).map(Number);
    leftList.push(leftNum);
    rightList.push(rightNum);

    // For part 2: count occurrences of the right numbers using a map
    rightCounter.set(rightNum, (rightCounter.get(rightNum) || 0) + 1);
});

let sortedLeftList:  number[] = [...leftList].sort((a, b) => a - b);
let sortedRightList: number[] = [...rightList].sort((a, b) => a - b);

let totalDistance = 0;
let totalSimilarityScore = 0;

for (let i = 0; i < leftList.length; i++) {
    totalDistance += Math.abs(sortedLeftList[i] - sortedRightList[i]);
    totalSimilarityScore += leftList[i] * (rightCounter.get(leftList[i]) || 0);
}

console.log(`Part 1: ${totalDistance}`);        // 2192892
console.log(`Part 2: ${totalSimilarityScore}`); // 22962826