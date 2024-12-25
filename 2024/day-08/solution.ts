import { readInputToArray } from '../input-utils';

let grid: string[] = readInputToArray('input.txt');

let antennaMap: { [key: string]: number[][]} = {};

// input processing
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        let freq: string = grid[i][j];
        if (freq !== '.') {
            if (!antennaMap[freq])
                antennaMap[freq] = [];
            antennaMap[freq].push([i, j]);
        }       
    }
}

function isInBounds(loc: number[]): boolean {
    return 0 <= loc[0] && loc[0] < grid.length 
        && 0 <= loc[1] && loc[1] < grid[0].length;
} 

function findAntinodeLocations(part: number): number {
    let antinodeLocations = new Set<string>();

    for (let freq of Object.keys(antennaMap)) {
        for (let i = 0; i < antennaMap[freq].length; i++) {
            for (let j = i + 1; j < antennaMap[freq].length; j++) {
                let [x1, y1]: number[] = antennaMap[freq][i];
                let [x2, y2]: number[] = antennaMap[freq][j];
    
                let xdiff = x2 - x1;
                let ydiff = y2 - y1;
                
                let antinodeLoc1 = [x1-xdiff, y1-ydiff];
                let antinodeLoc2 = [x2+xdiff, y2+ydiff];
    
                if (part === 1) {
                    // part 1: only add twice the distance
                    if (isInBounds(antinodeLoc1))
                        antinodeLocations.add(JSON.stringify(antinodeLoc1));
                    if (isInBounds(antinodeLoc2))
                        antinodeLocations.add(JSON.stringify(antinodeLoc2));
                } else if (part === 2) {
                    // add the locations of the antennae
                    antinodeLocations.add(JSON.stringify([x1, y1]));
                    antinodeLocations.add(JSON.stringify([x2, y2]));

                    // loop until both antinode locations are out of bounds
                    while (isInBounds(antinodeLoc1) || isInBounds(antinodeLoc2)) {
                        if (isInBounds(antinodeLoc1))
                            antinodeLocations.add(JSON.stringify(antinodeLoc1));
                        if (isInBounds(antinodeLoc2))
                            antinodeLocations.add(JSON.stringify(antinodeLoc2));
                        
                        antinodeLoc1 = [antinodeLoc1[0] - xdiff, antinodeLoc1[1] - ydiff];
                        antinodeLoc2 = [antinodeLoc2[0] + xdiff, antinodeLoc2[1] + ydiff];
                    }
                }
            }
        }
    }
    return antinodeLocations.size;
}

let part1 = findAntinodeLocations(1);
let part2 = findAntinodeLocations(2);

console.log(`Part 1: ${part1}`); // 276
console.log(`Part 2: ${part2}`); // 991