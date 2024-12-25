import { readInputToString } from '../input-utils';

function changeStone(stone: number): number[] {
    if (stone === 0) {
        return [1];
    } else if (stone.toString().length % 2 === 0) {
        const numStr = stone.toString();
        const mid = numStr.length / 2;
        return [numStr.substring(0, mid), numStr.substring(mid)].map(Number);
    } 
    return [stone * 2024];
}

function blink(numBlinks: number): number {
    // key: stone number, value: amount of stones (initially 1)
    let counter = new Map<number, number>(readInputToString('input.txt')
        .split(' ')
        .map(x => [parseInt(x), 1])
    );

    for (let _ = 0; _ < numBlinks; _++) {
        // make a new map to avoid issues with changing the original map during iteration
        let newCounter = new Map<number, number>();
        counter.forEach((count, stone) => {
            // for each new stone n, its count is accumulated by the amount of stones of its previous state
            const newStones: number[] = changeStone(stone);
            for (const n of newStones)
                newCounter.set(n, (newCounter.get(n) || 0) + count);
        });
        counter = newCounter;
    }
    
    let numStones = 0;
    counter.forEach((count) => numStones += count);
    return numStones;
}    

console.log(`Part 1: ${blink(25)}`); // 202019
console.log(`Part 2: ${blink(75)}`); // 239321955280205