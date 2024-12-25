const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r\n\r\n/);
}

let input = inputArray('input.txt').map(x => x.split(/\r\n/))

function inRightOrder(left, right) {
    for (let i = 0; i < left.length; i++) {
        if (right[i] == undefined) 
            return -1;

        let l = left[i], r = right[i];

        if (typeof l == 'number' && typeof r == 'number') {
            if (l == r)
                continue;
            return l < r ? 1 : -1;
        } else if (typeof l == 'object' && typeof r == 'object') {
            let x = inRightOrder(l, r);
            if (x == 0) 
                continue;
            return x;
        } else { 
            if (typeof l == 'number') l = [l];
            else r = [r];
            return inRightOrder(l, r);
        }
    }
    if (left.length == right.length)
        return 0;
    return 1;
}

let idxSum = 0;
let packets = [ [[2]] , [[6]] ];
for (let i = 0; i < input.length; i++) {
    let l = eval(input[i][0]), r = eval(input[i][1]);
    packets.push(l, r);
    if (inRightOrder(l, r) == 1) 
        idxSum += i+1;
}

packets.sort((a, b) => inRightOrder(b, a));
let dividerPacketIdx2;
let dividerPacketIdx6;
packets.forEach((lst, idx) => {
    if (lst.length == 1) {
        if (lst[0] == 2) dividerPacketIdx2 = idx + 1;
        if (lst[0] == 6) dividerPacketIdx6 = idx + 1;
    }
});

// Today I had the most wrong guesses for part 1 (8 times)
console.log(`Part 1: ${idxSum}`);
console.log(`Part 2: ${dividerPacketIdx2 * dividerPacketIdx6}`);