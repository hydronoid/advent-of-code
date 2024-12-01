import * as fs from 'fs';

/**
 * Reads a file synchronously and returns its content as an array of lines.
 * This function blocks the execution until the file is read completely.
 * @param filePath The path to the input file.
 * @returns An array of lines from the file.
 */
export function readInputToArray(filePath: string): string[] {
    try {
        const data: string = fs.readFileSync(filePath, 'utf-8');
        return data.split(/\r?\n/);
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
}