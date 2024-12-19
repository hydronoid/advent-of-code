import { readInputToArray } from '../input-utils';

const data: string[] = readInputToArray('input.txt');
const patterns: string[] = data[0].split(', ');
const designs: string[] = data.slice(2);
let memo: { [key: string]: number } = {};

function dfs(currentStr: string, targetStr: string): number {
    if (currentStr === targetStr)
        return 1;

    const remainingStr = targetStr.slice(currentStr.length);
    if (memo.hasOwnProperty(remainingStr))
        return memo[remainingStr];

    let ways = 0;

    for (const p of patterns)
        if (targetStr.startsWith(currentStr + p))
            ways += dfs(currentStr + p, targetStr);

    memo[remainingStr] = ways;
    return ways;
}

let part1 = 0, part2 = 0;
for (const d of designs) {
    const totalWays = dfs('', d);
    part1 += totalWays > 0 ? 1 : 0;
    part2 += totalWays;
}

console.log(`Part 1: ${part1}`);    // 360
console.log(`Part 2: ${part2}`);    // 577474410989846