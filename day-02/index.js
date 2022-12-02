const fs = require('fs');

/*
A, X: Rock
B, Y: Paper
C, Z: Scissors
*/
const outcomesPart1 = {
    "A": {"X": 3, "Y": 6, "Z": 0},
    "B": {"X": 0, "Y": 3, "Z": 6},
    "C": {"X": 6, "Y": 0, "Z": 3}
};
const shapeScorePart1 = {"X": 1, "Y": 2, "Z": 3};

/*
A, X: Rock, Loss
B, Y: Paper, Draw
C, Z: Scissors, Win
*/
const outcomesPart2 = {"X": 0, "Y": 3, "Z": 6,};
const shapeScorePart2 = {
    "A": {"X": 3, "Y": 1, "Z": 2},
    "B": {"X": 1, "Y": 2, "Z": 3},
    "C": {"X": 2, "Y": 3, "Z": 1}
};

function inputArray(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split(/\r?\n/);
}

function solution(filename) {
    let arr = inputArray(filename);
    let part1 = 0, part2 = 0;
    for (let i = 0; i < arr.length-1; i++) {
        let opponentShape = arr[i][0], myShape = arr[i][2];
        part1 += outcomesPart1[opponentShape][myShape] + shapeScorePart1[myShape];
        part2 += outcomesPart2[myShape] + shapeScorePart2[opponentShape][myShape];
    }
    console.log(part1);
    console.log(part2);
}

solution('sample.txt');
solution('input.txt');