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
}

function isInBounds(i: number, j: number, keypad: string[]): boolean {
    return 0 <= i && i < keypad.length 
        && 0 <= j && j < keypad[0].length;
}

function filterToShortest(moveLst: string[]): string[] {
    const shortestPathLen = Math.min(...moveLst.map(x => x.length));
    return moveLst.filter(x => x.length === shortestPathLen)
}

function filterToBest(moveLst: string[]): string[] {
    function sameConsecutiveMoves(moves: string) {
        let score = 0;
        let consecutiveCount = 1;
        for (let i = 1; i < moves.length; i++) {
            if (moves[i] === moves[i-1]) {
                consecutiveCount++;
            } else {
                score += consecutiveCount ** 2;
                consecutiveCount = 1;
            }
        }
        return score;
    }
    const bestScore = Math.max(...moveLst.map(sameConsecutiveMoves));
    
    return moveLst.filter(moves => sameConsecutiveMoves(moves) === bestScore);
}

function getPos(char: string, keypad: string[]) {
    for (let i = 0; i < keypad.length; i++)
        for (let j = 0; j < keypad[0].length; j++)
            if (keypad[i][j] === char)
                return [i, j];
    
    return [-1, -1]
}

function bfs(keypad: string[], start: string, end: string) {
    let queue = [[start, start, '']];
    let validMoves: string[] = [];

    while (queue.length > 0) {
        const [curr, path, moves] = queue.shift()!;
        if (curr === end) {
            validMoves.push(moves);
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
    return filterToShortest(validMoves);
}

function optimalMoves(keypad: string[]): { [key: string]: { [key: string]: string[] } } {
    let moveMap: { [key: string]: { [key: string]: string[] } } = {};

    for (let i = 0; i < keypad.length; i++) {
        for (let j = 0; j < keypad[0].length; j++) {
            const a = keypad[i][j];
            moveMap[a] = {};
            for (let i2 = 0; i2 < keypad.length; i2++) {
                for (let j2 = 0; j2 < keypad[0].length; j2++) {
                    const b = keypad[i2][j2];
                    moveMap[a][b] = bfs(keypad, a, b);
                }
            }
        }
    }
    
    return moveMap;
}

function shortestSeq(code: string, numeric: boolean): string[] {
    // start at A
    let queue: [string, number, string][] = [['', -1, 'A']];
    const moves = numeric ? NUMPAD_MOVES : DIRPAD_MOVES;
    const shortestSequences: string[] = [];

    while (queue.length > 0) {
        const [currPath, codeIdx, a] = queue.shift()!;
        if (codeIdx === code.length - 1) {
            shortestSequences.push(currPath);
            continue;
        }
        const b = code[codeIdx + 1];
        for (const path of moves[a][b]) {
            queue.push([currPath + path + 'A', codeIdx + 1, b]);
        }

    }
    return filterToBest(filterToShortest(shortestSequences));
}

const DIRPAD_MOVES = optimalMoves(DIRPAD);
const NUMPAD_MOVES = optimalMoves(NUMPAD);

let part1 = 0;

// takes 35 seconds XD
for (const code of data) {
    let minLength: number = Infinity;
    const lv1 = shortestSeq(code, true);
    for (const lv1Code of lv1) {
        const lv2 = shortestSeq(lv1Code, false);
        for (const lv2Code of lv2) {
            const lv3 = shortestSeq(lv2Code, false);
            minLength = Math.min(minLength, lv3[0].length);
        }
    }
    // console.log(code, minLength)
    part1 += minLength * parseInt(code);

}


console.log(part1); // 176870