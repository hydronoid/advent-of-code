import * as fs from 'fs';

export function readInputToArray(filePath: string): string[] {
    try {
        const data: string = fs.readFileSync(filePath, 'utf-8');
        return data.split(/\r?\n/);
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
}

export function readInputToString(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        throw new Error(`Error reading file: ${err.message}`);
    }
}