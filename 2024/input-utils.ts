import { readFileSync } from 'fs';

export function readInputToArray(filePath: string): string[] {
    try {
        const data: string = readFileSync(filePath, 'utf-8');
        return data.split(/\r?\n/);
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`Error reading file: ${err.message}`);
        }
        throw new Error('An unknown error occurred while reading the file.');
    }
}

export function readInputToString(filePath: string): string {
    try {
        return readFileSync(filePath, 'utf-8');
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`Error reading file: ${err.message}`);
        }
        throw new Error('An unknown error occurred while reading the file.');
    }
}
