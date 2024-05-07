import { describe, expect, test } from 'vitest';
import parserMappings from '../parserMapping.json';

describe('Internal types must be unique', () => {
    const internalTypes = new Set();

    const addIfNotExists = (internalType) => {
        test(`${internalType} must be unique`, () => {
            expect(internalTypes.has(internalType)).toBe(false);
            internalTypes.add(internalType);
        });
    };

    for (const type in parserMappings) {
        if (typeof parserMappings[type] === 'string') {
            addIfNotExists(parserMappings[type]);
        } else if (Array.isArray(parserMappings[type])) {
            for (const variant of parserMappings[type]) {
                addIfNotExists(variant.__type);
            }
        }
    }
});
