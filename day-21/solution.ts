import { readInputToArray } from '../input-utils';

const data: string[] = readInputToArray('input.txt');
const NUMPAD: string[] = [
    '789', 
    '456', 
    '123', 
    '.0A'
];
const DIRPAD: string[] = [
    '.^A',
    '<v>'
];

const DIRECTIONS: { [key: string]: [number, number] } = {
    '^': [-1, 0],
    'v': [1, 0],
    '<': [0, -1],
    '>': [0, 1],
};

function isInBounds(i: number, j: number, keypad: string[]): boolean {
    return 0 <= i && i < keypad.length 
        && 0 <= j && j < keypad[0].length;
}

function filterToOptimal(moveLst: string[]): string[] {
    function calculateScore(moves: string) {
        // score favours multiple of the same press
        // since it means we move around less
        let score = 0, consecutiveCount = 1;
        for (let i = 1; i <= moves.length; i++) {
            if (moves[i] === moves[i - 1]) {
                consecutiveCount++;
            } else {
                score += consecutiveCount ** 2;
                consecutiveCount = 1;
            }
        }
        return score;
    };
    
    // first we filter to the least amount of moves
    const shortestPathLen = Math.min(...moveLst.map(x => x.length));
    const shortestPaths = moveLst.filter(x => x.length === shortestPathLen);

    // then we filter to those that have the best score 
    // i.e. most amount of the same consecutive presses
    const bestScore = Math.max(...shortestPaths.map(calculateScore));
    return shortestPaths.filter(moves => calculateScore(moves) === bestScore);
}

function getPos(char: string, keypad: string[]): [number, number] {
    for (let i = 0; i < keypad.length; i++)
        for (let j = 0; j < keypad[0].length; j++)
            if (keypad[i][j] === char)
                return [i, j];
    
    return [-1, -1]
}

function bfs(keypad: string[], start: string, end: string): string[] {
    let queue = [[start, start, '']];
    let validMoves: string[] = [];

    while (queue.length > 0) {
        const [curr, path, moves] = queue.shift()!;
        if (curr === end) {
            validMoves.push(moves + 'A');
            continue;
        }
        const [i, j] = getPos(curr, keypad);

        for (const move of Object.keys(DIRECTIONS)) {
            const [di, dj] = DIRECTIONS[move];
            const i2 = i + di;
            const j2 = j + dj;

            if (isInBounds(i2, j2, keypad) && keypad[i2][j2] !== '.' && !path.includes(keypad[i2][j2])) {
                queue.push([keypad[i2][j2], path + keypad[i2][j2], moves + move]);
            }
        }
    }
    return filterToOptimal(validMoves);
}

function optimalMoves(keypad: string[]): { [key: string]: { [key: string]: string[] } } {
    let moveMap: { [key: string]: { [key: string]: string[] } } = {};

    // for a given keypad, find all optimal moves from
    // a given button a at (i, j) to b at (i2, j2) via BFS
    for (let i = 0; i < keypad.length; i++) {
        for (let j = 0; j < keypad[0].length; j++) {
            const a = keypad[i][j];
            if (a === '.')
                continue;
            moveMap[a] = {};
            for (let i2 = 0; i2 < keypad.length; i2++) {
                for (let j2 = 0; j2 < keypad[0].length; j2++) {
                    const b = keypad[i2][j2];
                    if (b === '.')
                        continue;
                    moveMap[a][b] = bfs(keypad, a, b);
                }
            }
        }
    }
    return moveMap;
}

function getDirPadSeqs(code: string): string[] {
    // start at A
    let queue: [string, number, string][] = [['', -1, 'A']];
    const seqs: string[] = [];

    while (queue.length > 0) {
        const [currPath, codeIdx, a] = queue.shift()!;
        if (codeIdx === code.length - 1) {
            seqs.push(currPath);
            continue;
        }
        const b = code[codeIdx + 1];
        for (const path of NUMPAD_MOVES[a][b])
            queue.push([currPath + path, codeIdx + 1, b]);
    }
    return filterToOptimal(seqs);
}

function minSeqLen(a: string, b: string, keypadNum: number): number {
    const key = a + b + keypadNum;
    if (memo.hasOwnProperty(key))
        return memo[key];

    let minLength = Infinity;

    for (const path of DIRPAD_MOVES[a][b]) {
        let seqLen = 0;
        if (keypadNum === 1) {
            // base case
            seqLen += path.length;
        } else {
            // start at A
            seqLen += minSeqLen('A', path[0], keypadNum - 1);
            for (let i = 0; i < path.length - 1; i++)
                seqLen += minSeqLen(path[i], path[i+1], keypadNum - 1);
        }
        minLength = Math.min(seqLen, minLength);
    }

    memo[key] = minLength;
    return minLength;
}

function calculateComplexity(code: string, robotKeypads: number): number {
    let minLength: number = Infinity;
    const seqs = getDirPadSeqs(code);
    for (const moves of seqs) {
        // start at A
        let seqLen = minSeqLen('A', moves[0], robotKeypads);
        for (let i = 0; i < moves.length - 1; i++)
            seqLen += minSeqLen(moves[i], moves[i+1], robotKeypads);

        minLength = Math.min(seqLen, minLength);
    }
    return minLength * parseInt(code);
}

// precompute optimal moves from A to B
// for the directional pad and number pad
const DIRPAD_MOVES = optimalMoves(DIRPAD);
const NUMPAD_MOVES = optimalMoves(NUMPAD);
let memo: { [key: string]: number } = {}; // for part 2 DFS
let part1 = 0, part2 = 0;

for (const code of data) {
    part1 += calculateComplexity(code, 2);
    part2 += calculateComplexity(code, 25);
}

// probably top 3 hardest puzzles I've done in AoC
// relied HEAVILY on subreddit hints to get both part 1 and 2 working
// because I had a lot of trouble completing it on my own.
// again code may be quite messy (esp. variable names)

console.log(`Part 1: ${part1}`);    // 176870
console.log(`Part 2: ${part2}`);    // 223902935165512