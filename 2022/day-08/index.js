const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

const trees = inputArray('input.txt').map(x => x.split('').map(Number));

function isVisible(i, j) {
    let treeHeight = trees[i][j];
    if ((i == 0 || j == 0) || (i == trees.length-1 || j == trees[0].length-1))
        return true;
    let row = trees[i];
    let col = trees.map(x => x[j]);
    
    return row.slice(0, j).every(x => x < treeHeight) ||
        row.slice(j+1).every(x => x < treeHeight)  ||
        col.slice(0, i).every(x => x < treeHeight) ||
        col.slice(i+1).every(x => x < treeHeight);
}

function scenicScore(i, j) {
    let treeHeight = trees[i][j];
    let row = trees[i];
    let col = trees.map(x => x[j]);

    let westTrees  = row.slice(0, j).reverse().findIndex(x => x >= treeHeight) + 1;
    let eastTrees  = row.slice(j+1).findIndex(x => x >= treeHeight) + 1;
    let northTrees = col.slice(0, i).reverse().findIndex(x => x >= treeHeight) + 1;
    let southTrees = col.slice(i+1).findIndex(x => x >= treeHeight) + 1;

    // All trees visible (-1 returned by findIndex)
    if (westTrees == 0)  westTrees  = row.slice(0, j).length;
    if (eastTrees == 0)  eastTrees  = row.slice(j+1).length;
    if (northTrees == 0) northTrees = col.slice(0, i).length;
    if (southTrees == 0) southTrees = col.slice(i+1).length;

    return westTrees * eastTrees * northTrees * southTrees;
}

let visibleTrees = 0;
let scenicScores = [];

for (let i = 0; i < trees.length; i++) {
    for (let j = 0; j < trees[0].length; j++) {
        if (isVisible(i, j)) {
            visibleTrees++;
        }
        scenicScores.push(scenicScore(i, j));
    }
}

console.log(`Part 1: ${visibleTrees}`);
console.log(`Part 2: ${Math.max(...scenicScores)}`);