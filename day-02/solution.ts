import { readInputToArray } from '../input-utils';

let data: string[] = readInputToArray('input.txt');
let safeReportCount = 0, dampenedSafeReportCount = 0;

data.forEach((line: string) => {
    const report: number[] = line.split(/\s+/).map(Number);

    // part 1
    safeReportCount += isSafeReport(report) ? 1 : 0;

    // brute force for part 2 :)
    for (let i = 0; i < report.length; i++) {
        // new report (subreport) removing the level at index i
        let subreport: number[] = [...report.slice(0, i), ...report.slice(i + 1)];
        if (isSafeReport(subreport)) {
            dampenedSafeReportCount += 1;
            break;
        }
    }
});

function isSafeReport(report: number[]): boolean {
    let lastDiff: number = report[1] - report[0];
    for (let i = 1; i < report.length; i++) {
        const levelDiff: number = report[i] - report[i-1];
        // Difference is 0 or >3                         or sign differs from the last level
        if (levelDiff == 0 || Math.abs(levelDiff) > 3 || Math.sign(lastDiff) !== Math.sign(levelDiff))
            return false

        lastDiff = levelDiff;
    }
    return true;
}

console.log(`Part 1: ${safeReportCount}`);          // 490
console.log(`Part 2: ${dampenedSafeReportCount}`);  // 536