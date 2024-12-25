import { readInputToString } from '../input-utils';

const [inits, gates] = readInputToString('input.txt')
    .split('\r\n\r\n')
    .map(str => str.split("\r\n"));

const wires: { [key: string]: boolean } = {};

for (const line of inits) {
    const [wire, val] = line.split(": ");
    wires[wire] = val === "1";
}

function applyGate(in1: string, gate: string, in2: string, out: string): void {
    if (gate === "AND")      wires[out] = wires[in1] && wires[in2];
    else if (gate === "OR")  wires[out] = wires[in1] || wires[in2]; 
    else if (gate === "XOR") wires[out] = wires[in1] != wires[in2];
}

function filterWires(startingChar: string): string[] {
    const wireSet = new Set<string>();

    for (const line of gates) {
        const [in1, _, in2, __, out] = line.split(" ");
        if (in1.startsWith(startingChar)) wireSet.add(in1);
        if (in2.startsWith(startingChar)) wireSet.add(in2);
        if (out.startsWith(startingChar)) wireSet.add(out);
    }

    return Array.from(wireSet).sort().reverse();
}

function wiresToDecimal(wireLst: string[]): number {
    return parseInt(wireLst.map(x => wires[x] ? "1" : "0").join(""), 2);
}

// Part 1
const zWires = filterWires('z');

// just continue applying gates until all z wires have a value
while (!zWires.every(z => wires.hasOwnProperty(z))) {
    for (const line of gates) {
        const [in1, gate, in2, _, out] = line.split(" ");
        if (wires.hasOwnProperty(in1) && wires.hasOwnProperty(in2))
            applyGate(in1, gate, in2, out);
    }
}

const part1 = wiresToDecimal(zWires);

// Part 2
const toSwap = new Set<string>();

// essentially, check if each connection violates any rules of a ripple-carry adder
// since we know there are only 8, and we have to output them in alphabetical order,
// we just keep a set of violations and we don't have actually to swap anything.
for (const line of gates) {
    const [in1, gate, in2, _, out] = line.split(" ");

    // all gates that output z must be XOR, unless it is the last one (z45)
    if (out.startsWith('z') && gate !== 'XOR' && out !== zWires[0]) {
        toSwap.add(out);
    }

    // XOR gates must output z or have x,y / y,x inputs
    if (
        gate === "XOR" && !out.startsWith('z')
        && !in1.startsWith('x') && !in1.startsWith('y')
        && !in2.startsWith('x') && !in2.startsWith('y')
    ) {
        toSwap.add(out);
    }

    // the result of an AND must feed into an OR, except when one input to the AND is x00
    if (gate === "AND" && !(in1 === "x00" || in2 === "x00")) {
        for (const line2 of gates) {
            const [in3, gate2, in4, _, __] = line2.split(" ");
            if (gate2 !== "OR" && (in3 === out || in4 === out)) {
                toSwap.add(out);
            }
        }
    }

    // the result of an XOR must never feed into an OR
    if (gate === "XOR") {
        for (const line2 of gates) {
            const [in3, gate2, in4, _, __] = line2.split(" ");
            if (gate2 === "OR" && (in3 === out || in4 === out)) {
                toSwap.add(out);
            }
        }
    }
}

// had no idea what to do for part 2 again, so I looked on the subreddit.

console.log(`Part 1: ${part1}`);                        // 65635066541798
console.log(`Part 2: ${[...toSwap].sort().join(',')}`)  // dgr,dtv,fgc,mtj,vvm,z12,z29,z37