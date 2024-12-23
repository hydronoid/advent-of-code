import { readInputToArray } from '../input-utils';

const data: string[] = readInputToArray('input.txt');
const graph: { [key: string]: string[] } = {};
data.forEach((line: string) => {
    const [a, b] = line.split("-");
    graph[a] = graph[a] ?? [];
    graph[b] = graph[b] ?? [];
    
    graph[a].push(b);
    graph[b].push(a);
});

function count3CliquesWithTPrefix(graph: { [key: string]: string[] }): number {
    const threes = new Set<string>();

    for (const a of Object.keys(graph)) {
        for (const b of graph[a]) {
            for (const c of graph[b]) {
                if (graph[a].includes(c)) {
                    const key = [a, b, c].sort();
                    if (key.some(node => node.startsWith('t'))) {
                        threes.add(key.join('-'));
                    }
                }
            }
        }
    }
    return threes.size;
}

function intersection(setA: Set<string>, setB: Set<string>): Set<string> {
    // since intersection is not a method on older versions, it is implemented manually here
    return new Set([...setA].filter(x => setB.has(x)));
}

function bronKerbosch(p: Set<string>, r: Set<string>, x: Set<string>): void {
    if (p.size === 0 && x.size === 0) {
        if (r.size > maxSize) {
            maxSize = r.size;
            password = [...r.values()].sort().join(',');
        }
        return;
    }

    p.forEach((v: string) => {
        const r2 = new Set(r);
        r2.add(v);
        const vNeighbours = new Set(graph[v]);
        const p2 = intersection(p, vNeighbours);
        const x2 = intersection(x, vNeighbours);
        
        bronKerbosch(p2, r2, x2);

        p.delete(v);
        x.add(v);
    });
}

const part1 = count3CliquesWithTPrefix(graph);

let maxSize = 0;
let password = '';
let p = new Set<string>(Object.keys(graph));
let r = new Set<string>();
let x = new Set<string>();
bronKerbosch(p, r, x)

// did a bit of googling today for part 2 ;)

console.log(`Part 1: ${part1}`);        // 1230
console.log(`Part 2: ${password}`);     // az,cj,kp,lm,lt,nj,rf,rx,sn,ty,ui,wp,zo