import { readInputToArray } from '../input-utils';

const data: number[] = readInputToArray('input.txt').map(Number);

function prune(n: number) { return n % 16777216; }
function mix(val: number, secretNum: number) { return (val ^ secretNum) >>> 0; } // cast to unsigned, in case XOR overflows 32 bits

function calcSecretNumber(n: number): number {
    let res = n;
    const mul64 = res * 64;
    res = mix(mul64, res);
    res = prune(res);
    const div32 = Math.floor(res / 32);
    res = mix(div32, res);
    res = prune(res);
    const mul2048 = res * 2048;
    res = mix(mul2048, res);
    res = prune(res);
    return res;
}

function calcPrices(priceLst: number[][], priceChangeLst: number[][]): { [key: string]: number } {
    // key: sequence of price changes
    // val: total price across all initial numbers
    let totalPrice: { [key: string]: number } = {};
    let seen = new Set<string>();

    // use a sliding window (j to j+4) over the all the price changes
    // then for each valid sequence in the window, accumulate the sell price in the totalPrice object
    for (let i = 0; i < priceLst.length; i++) {
        for (let j = 0; j < priceChangeLst[0].length - 3; j++) {
            const seq = JSON.stringify(priceChangeLst[i].slice(j, j+4));

            // if we have already seen this sequence before for the i-th initial number
            // it means it's not the first occurrence of this sequence, so we just skip it
            if (seen.has(i+seq))
                continue;
            
            seen.add(i+seq);

            // sellPrice is at j+4 since priceLst has 1 more entry than priceChangeLst
            const sellPrice = priceLst[i][j+4]; 
            totalPrice[seq] = (totalPrice[seq] || 0) + sellPrice;
        }
    }
    return totalPrice;
}

let part1 = 0;
let priceList: number[][] = [];
let priceChangeList: number[][] = [];

for (let n of data) {
    let prices: number[] = [];
    for (let i = 0; i < 2000; i++) {
        prices.push(n % 10);
        n = calcSecretNumber(n);
    }
    part1 += n;

    // for part 2
    let priceChanges: number[] = [];
    for (let i = 1; i < prices.length; i++)
        priceChanges.push(prices[i] - prices[i-1]);
    priceList.push(prices);
    priceChangeList.push(priceChanges);
}

const part2: number = Math.max(...Object.values(calcPrices(priceList, priceChangeList)));

console.log(`Part 1: ${part1}`);    // 14082561342
console.log(`Part 2: ${part2}`);    // 1568