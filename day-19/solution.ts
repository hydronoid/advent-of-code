import { readInputToArray } from '../input-utils';

const data: string[] = readInputToArray('input.txt');
const patterns: string[] = data[0].split(', ');
const designs: string[] = data.slice(2);
const memo: { [key: string]: boolean } = {};


function dfs(currentStr: string, targetStr: string): boolean {
    if (currentStr === targetStr) {
        memo[targetStr] = true;
        return true;
    }

    if (currentStr.length > targetStr.length)
        return false;

    for (const p of patterns) {
        const nextStr = currentStr + p;
        const remainingStr = targetStr.slice(nextStr.length);

        if (memo.hasOwnProperty(remainingStr) && remainingStr.length > 0) {
            // console.log(nextStr, remainingStr, memo[remainingStr])
            if (memo[remainingStr])
                return true;
            continue;
        }


        if (targetStr.startsWith(nextStr)) {
            const result = dfs(nextStr, targetStr);
            memo[remainingStr] = result;
            if (result)
                return true;
        }
    }

    memo[targetStr] = false;

    return false;
}


let part1 = 0;
for (const d of designs)
    if (dfs('', d))
        part1++;


console.log(part1);