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
    if (gate === "AND") wires[out] = wires[in1] && wires[in2];
    if (gate === "OR")  wires[out] = wires[in1] || wires[in2];
    if (gate === "XOR") wires[out] = wires[in1] != wires[in2];
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

function wiresToDecimal(wireLst: string[]) {
    return parseInt(wireLst.map(x => wires[x] ? "1" : "0").join(""), 2);
}

const zWires = filterWires('z');

while (!zWires.every(wire => wires.hasOwnProperty(wire))) {
    for (const line of gates) {
        const [in1, gate, in2, _, out] = line.split(" ");
        if (wires.hasOwnProperty(in1) && wires.hasOwnProperty(in2))
            applyGate(in1, gate, in2, out);
    }
}

const part1 = wiresToDecimal(zWires);
console.log(part1);     // 65635066541798
