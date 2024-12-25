const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const input = inputArray('input.txt');
let sensors = [];
let minX = minY = Infinity;
let maxX = maxY = -Infinity;
let maxDist = 0;

input.forEach((line, idx) => {
    let [sensorStr, beaconStr] = line.split(': ');
    sensors.push(
        {
            sensorLoc: sensorStr
                .replace(/(Sensor at )|(x=)|(y=)/g, '')
                .split(',')
                .map(Number),
            beaconLoc: beaconStr
                .replace(/(closest beacon is at )|(x=)|(y=)/g, '')
                .split(',')
                .map(Number),
        }
    );
    let s = sensors[idx];
    s.distance = manhattanDist(s.sensorLoc, s.beaconLoc);
    maxDist = Math.max(maxDist, s.distance);

    let [x1, y1] = s.sensorLoc;
    let [x2, y2] = s.beaconLoc;
    minX = Math.min(minX, x1 - s.distance, x2 - s.distance);
    minY = Math.min(minY, y1 - s.distance, y2 - s.distance);
    maxX = Math.max(maxX, x1 + s.distance, x2 + s.distance);
    maxY = Math.max(maxY, y1 + s.distance, y2 + s.distance);
});

function manhattanDist(pointA, pointB) {
    let [x1, y1] = pointA;
    let [x2, y2] = pointB;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function canContainBeacon(location) {
    for (let s of sensors) {
        // Beacon already placed at the location
        if (s.beaconLoc[0] == location[0] && s.beaconLoc[1] == location[1])
            return 0;

        // Point is within the range of a sensor already
        if (manhattanDist(s.sensorLoc, location) <= s.distance)
            return -1;
    }
    return 1;
}

function nonBeaconPositions(y) {
    let n = 0;
    for (let x = minX; x <= maxX; x++)
        if (canContainBeacon([x, y]) == -1)
            n++;
    return n;
}

function findDistressBeacon(mn, mx) {
    for (let s of sensors) {
        /*
        Search the perimeter of the sensor, like this:
        ..3..
        .2#2.
        1#S#1
        .2#2.
        ..3..
        where 1, 2, 3 represent points inspected in each iteration of the while loop
        */
        let [x, y] = s.sensorLoc;
        let yOffset = 0;
        let xOffset = s.distance + 1;
        while (xOffset >= 0) {
            let pts = [
                [x-xOffset, y+yOffset], // Top-left
                [x+xOffset, y+yOffset], // Top-right
                [x-xOffset, y-yOffset], // Bottom-left
                [x+xOffset, y-yOffset]  // Bottom-right
            ];
            for (let p of pts) {
                if (p[0] < mn || p[0] > mx || p[1] < mn || p[1] > mx)
                    continue;
                
                if (canContainBeacon(p) == 1)
                    return p[0]*4000000 + p[1];
            }
            xOffset--;
            yOffset++;
        }
    }
    return -1;
}

console.log(`Part 1: ${nonBeaconPositions(y=2000000)}`);
console.log(`Part 2: ${findDistressBeacon(0, 4000000)}`);