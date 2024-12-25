import { readInputToString } from '../input-utils';

let diskMap: string = readInputToString('input.txt');
let blocks: number[] = [];

// used for part 2
let freeSpaces: number[][] = [];
let fileSpaces: number[][] = [];

for (let i = 0; i < diskMap.length; i++) {
    let length = parseInt(diskMap[i]);
    let id = Math.floor(i/2);
    if (i%2 === 1)
        freeSpaces.push([blocks.length, length]);
    else
        fileSpaces.push([blocks.length, length, id]);

    for (let j = 0; j < length; j++)
        blocks.push(i%2 === 0 ? id : -1)
}

// part 1: move individually
function calcChecksum(blocks: number[]): number {
    let pos = 0, checksum = 0;
    while (pos < blocks.length) {
        if (blocks[pos] === -1) {
            let lastElement = blocks.pop() || 0;
            while (lastElement === -1)
                lastElement = blocks.pop() || 0;
    
            if (pos < blocks.length)
                blocks[pos] = lastElement;
            else
                blocks.push(lastElement);
        }
        if (pos < blocks.length)
            checksum += pos * blocks[pos];
        pos++;
    }
    return checksum
}

// part 2: move whole files
function calcWholeFileChecksum(blocks: number[]): number {
    // loop through file positions in reverse and try to move the files
    for (let [fileStart, fileLen, id] of fileSpaces.reverse()) {

        for (let i = 0; i < freeSpaces.length; i++) {
            let [spaceStart, spaceLen]: number[] = freeSpaces[i];

            // free space not found to the left of the file -> move to the next file
            if (spaceStart >= fileStart)
                break;

            // free space found
            if (fileLen <= spaceLen) {
                // move file to this free space
                blocks.fill(id, spaceStart, spaceStart + fileLen);

                // remove it from its previous position (fill it with empty space)
                blocks.fill(-1, fileStart, fileStart + fileLen);

                // remove the existing freeSpace entry at index i
                freeSpaces.splice(i, 1);
                // if there is still some space remaining, update the freeSpace entry at index i
                if (fileLen < spaceLen)
                    freeSpaces.splice(i, 0, [spaceStart + fileLen, spaceLen - fileLen]);
                break;
            }
        }
    }
    // calculate the checksum
    return blocks.reduce((acc, id, pos) => id !== -1 ? acc+id*pos : acc, 0);
}

console.log(`Part 1: ${calcChecksum([...blocks])}`);            // 6366665108136
console.log(`Part 2: ${calcWholeFileChecksum([...blocks])}`);   // 6398065450842