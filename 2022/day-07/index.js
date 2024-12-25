const fs = require('fs');

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

function arraySum(arr) {return arr.reduce((a, b) => a + b, 0);}

let lines = inputArray('input.txt');
let folders = {};
let currentPath = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].split(' ');
    if (line[1] == 'cd') {
        if (line[2] == '..') {
            currentPath.pop();
        } else {
            currentPath.push(line[2]);

            // Initialise a folder's information
            folders[currentPath.join('/')] = {
                dirs: [], 
                fileSizes: []
            };
        }
    } else if (line[0] != '$') {
        let currentDir = currentPath.join('/');
        if (line[0] == 'dir') {
            // Store info about the directories it contains
            folders[currentDir].dirs.push(line[1]);
        } else {
            // Store the info about the files it contains
            folders[currentDir].fileSizes.push(parseInt(line[0]));
        }
    }
}

let folderSizes = [];
function getFolderSize(folderName) {
    let folderSum = 0;
    for (let i = 0; i < folders[folderName].dirs.length; i++)
        folderSum += getFolderSize(folderName + "/" + folders[folderName].dirs[i]);
    
    let currentFolderSize = folderSum + arraySum(folders[folderName].fileSizes)
    folderSizes.push(currentFolderSize)
    return currentFolderSize;
}
getFolderSize('/'); // Recursively determine the sizes of folders, placing them in the folderSizes array


console.log(`Part 1: ${arraySum(folderSizes.filter(x => x<=100000))}`);

folderSizes.sort((a, b) => a - b);
let minSpaceRequired = 30000000 - (70000000 - Math.max(...folderSizes));
console.log(`Part 2: ${folderSizes.filter(x => x >= minSpaceRequired)[0]}`);