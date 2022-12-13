const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const map = inputArray('input.txt')
let startNode, endNode;
for (let i=0; i<map.length; i++) {
    if (map[i].indexOf('S') != -1)
        startNode = [i, map[i].indexOf('S')];
    if (map[i].indexOf('E') != -1)
        endNode = [i, map[i].indexOf('E')];
}

// Initialise edges
let edges = {};
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        edges[[i, j]] = [];
        let adjNodes = [[i-1, j], [i+1, j], [i, j-1], [i, j+1]];
        for (let k = 0; k<adjNodes.length; k++) {
            let [a, b] = adjNodes[k];
            if (map[a] == undefined || map[a][b] == undefined)
                continue;

            if (elevation(map[i][j]) >= elevation(map[a][b]) - 1) 
                edges[[i, j]].push([a, b]);
        }
    }
}

function elevation(char) {
    if (char == 'S') return 'a'.charCodeAt(0);
    else if (char == 'E') return 'z'.charCodeAt(0);
    
    return char.charCodeAt(0);
}

function BFS(source) {
    let visited = [...Array(map.length)].map(row => Array(map[0].length).fill(false));
    let distance = [...Array(map.length)].map(row => Array(map[0].length).fill(Infinity));
    var queue = [source];
    let [s1, s2] = source;
    distance[s1][s2] = 0;

    while (queue.length > 0) {
        let [a, b] = queue.shift();
        if (visited[a][b]) 
            continue;
        visited[a][b] = true;

        for (let i=0; i<edges[[a, b]].length; i++) {
            let [u, v] = edges[[a,b]][i];
            if (distance[a][b] + 1 < distance[u][v]) {
                distance[u][v] = distance[a][b] + 1;
                queue.push([u, v]);
            }
        }
    }
    return distance;
}

function multiBFS() {
    let shortest = Infinity;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 'a') {
                let dists = BFS([i, j]);
                if (dists[endNode[0]][endNode[1]] < shortest)
                    shortest = dists[endNode[0]][endNode[1]];
            }
        }
    }
    return shortest;
}

console.log(`Part 1: ${BFS(startNode)[endNode[0]][endNode[1]]}`);
console.log(`Part 2: ${multiBFS()}`);