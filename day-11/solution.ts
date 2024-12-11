import { readInputToString } from '../input-utils';

let arr: number[] = readInputToString('input.txt').split(' ').map(Number);

function blink(stone: number): number[] {
    if  (stone === 0) {
        return [1];
    } else if (stone.toString().length % 2 === 0) {
        const numStr = stone.toString();
        const mid = numStr.length / 2;
        return [numStr.substring(0, mid), numStr.substring(mid)].map(Number);
    } 
    return [stone * 2024];
}

for (let i = 0; i < 25; i++) {
    let newArr: number[] = [];
    arr.forEach((stone) => newArr.push(...blink(stone)));
    arr = newArr;
}

console.log(arr.length);